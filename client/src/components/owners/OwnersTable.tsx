import * as React from 'react';

import { IOwner } from '../../types';

type SortKey = 'name' | 'address' | 'city' | 'telephone' | 'pets';
type SortDirection = 'asc' | 'desc';

interface IOwnersTableProps {
  owners: IOwner[];
}

interface IOwnersTableState {
  sortKey: SortKey;
  sortDirection: SortDirection;
}

const getOwnerSortValue = (owner: IOwner, key: SortKey) => {
  switch (key) {
    case 'name':
      return `${owner.lastName} ${owner.firstName}`.toLowerCase();
    case 'address':
      return (owner.address || '').toLowerCase();
    case 'city':
      return (owner.city || '').toLowerCase();
    case 'telephone':
      return (owner.telephone || '').toLowerCase();
    case 'pets':
      return owner.pets.map(pet => pet.name).join(', ').toLowerCase();
    default:
      return '';
  }
};

const renderRow = (owner: IOwner) => (
  <tr key={owner.id}>
    <td>
      <a href={`/owners/${owner.id}`}>
        {owner.firstName} {owner.lastName}
      </a>
    </td>
    <td className='hidden-sm hidden-xs'>{owner.address}</td>
    <td>{owner.city}</td>
    <td>{owner.telephone}</td>
    <td className='hidden-xs'>{owner.pets.map(pet => pet.name).join(', ')}</td>
  </tr>
);

export default class OwnersTable extends React.Component<IOwnersTableProps, IOwnersTableState> {
  constructor(props: IOwnersTableProps) {
    super(props);

    this.state = {
      sortKey: 'name',
      sortDirection: 'asc'
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(key: SortKey) {
    this.setState(prevState => {
      if (prevState.sortKey === key) {
        return {
          sortKey: key,
          sortDirection: prevState.sortDirection === 'asc' ? 'desc' : 'asc'
        };
      }

      return {
        sortKey: key,
        sortDirection: 'asc'
      };
    });
  }

  getSortedOwners() {
    const { owners } = this.props;
    const { sortKey, sortDirection } = this.state;
    const sorted = owners.slice().sort((left, right) => {
      const leftValue = getOwnerSortValue(left, sortKey);
      const rightValue = getOwnerSortValue(right, sortKey);

      if (leftValue < rightValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (leftValue > rightValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }

  renderSortIndicator(key: SortKey) {
    const { sortKey, sortDirection } = this.state;
    if (sortKey !== key) {
      return null;
    }

    return (
      <span aria-hidden='true'> {sortDirection === 'asc' ? '▲' : '▼'}</span>
    );
  }

  renderSortButton(label: string, key: SortKey, className?: string) {
    const { sortKey, sortDirection } = this.state;
    const ariaSort = sortKey === key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';

    return (
      <th aria-sort={ariaSort} className={className}>
        <button
          type='button'
          className='table-sort-button'
          onClick={() => this.onSort(key)}
        >
          {label}{this.renderSortIndicator(key)}
        </button>
      </th>
    );
  }

  render() {
    const { owners } = this.props;

    if (!owners) {
      return null;
    }

    const sortedOwners = this.getSortedOwners();

    return (
      <section>
        <h2>{owners.length} Owners found</h2>
        <table className='table table-striped'>
          <thead>
            <tr>
              {this.renderSortButton('Name', 'name')}
              {this.renderSortButton('Address', 'address', 'hidden-sm hidden-xs')}
              {this.renderSortButton('City', 'city')}
              {this.renderSortButton('Telephone', 'telephone')}
              {this.renderSortButton('Pets', 'pets', 'hidden-xs')}
            </tr>
          </thead>
          <tbody>
            {sortedOwners.map(renderRow)}
          </tbody>
        </table>
      </section>
    );
  }
}
