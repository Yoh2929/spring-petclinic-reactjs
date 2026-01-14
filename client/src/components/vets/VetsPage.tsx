import * as React from 'react';

import { IRouter, Link } from 'react-router';
import { url } from '../../util';

import { IVet } from '../../types';

type VetSortKey = 'name' | 'specialties';
type VetSortDirection = 'asc' | 'desc';

interface IVetsPageState {
  vets: IVet[];
  sortKey: VetSortKey;
  sortDirection: VetSortDirection;
}

export default class VetsPage extends React.Component<void, IVetsPageState> {
  constructor() {
    super();

    this.state = {
      vets: [],
      sortKey: 'name',
      sortDirection: 'asc'
    };

    this.onSort = this.onSort.bind(this);
  }

  componentDidMount() {
    const requestUrl = url('api/vets');

    fetch(requestUrl)
      .then(response => response.json())
      .then(vets => { console.log('vets', vets); this.setState({ vets }); });
  }

  onSort(key: VetSortKey) {
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

  getSortedVets() {
    const { vets, sortKey, sortDirection } = this.state;

    return vets.slice().sort((left, right) => {
      const leftValue = sortKey === 'name'
        ? `${left.lastName} ${left.firstName}`.toLowerCase()
        : left.specialties.map(specialty => specialty.name).join(', ').toLowerCase();
      const rightValue = sortKey === 'name'
        ? `${right.lastName} ${right.firstName}`.toLowerCase()
        : right.specialties.map(specialty => specialty.name).join(', ').toLowerCase();

      if (leftValue < rightValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (leftValue > rightValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  renderSortIndicator(key: VetSortKey) {
    const { sortKey, sortDirection } = this.state;
    if (sortKey !== key) {
      return null;
    }

    return (
      <span aria-hidden='true'> {sortDirection === 'asc' ? '▲' : '▼'}</span>
    );
  }

  renderSortButton(label: string, key: VetSortKey) {
    const { sortKey, sortDirection } = this.state;
    const ariaSort = sortKey === key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';

    return (
      <th aria-sort={ariaSort}>
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
    const { vets } = this.state;

    if (!vets) {
      return <h2>Veterinarians</h2>;
    }

    return (
      <span>
        <h2>Veterinarians</h2>
        <table className='table table-striped'>
          <thead>
            <tr>
              {this.renderSortButton('Name', 'name')}
              {this.renderSortButton('Specialties', 'specialties')}
            </tr>
          </thead>
          <tbody>

            {this.getSortedVets().map(vet => (
              <tr key={vet.id}>
                <td>{vet.firstName} {vet.lastName}</td>
                <td>{vet.specialties.length > 0 ? vet.specialties.map(specialty => specialty.name).join(', ') : 'none'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </span>
    );
  }
}
