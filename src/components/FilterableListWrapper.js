import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/components';
import { entityAttributesProperty } from '../ducks/modules/network';
import sortOrder from '../utils/sortOrder';

class FilterableListWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSortOrder: {
        ...this.props.initialSortOrder[0], // For now, just respect the first default sort rule
      },
      filterValue: '',
    };
  }

  /**
    *
    */
  onFilterChange = (event) => {
    this.setState({
      filterValue: event.target.value,
    });
  };

  /**
    * @param {string} current property
    * @return character to indicate sort direction (if applicable)
    */
  getDirection = (property) => {
    if (property === this.state.activeSortOrder.property) {
      return this.state.activeSortOrder.direction === 'asc' ? ' \u25B2' : ' \u25BC';
    }
    return '';
  };

  /**
    * @return filtered list
    * This filter works by testing if the filterValue is present in either the any of node
    * node attributes.
    *
    * TODO: specify search attributes, include fuzziness, match start of string only.
    */
  getFilteredList = (list) => {
    const filterValue = this.state.filterValue.toLowerCase();
    if (!filterValue) { return list; }

    const filteredList = list.filter(
      (node) => {
        const nodeDetails = Object.values(node[entityAttributesProperty]);
        // Include in filtered list if any of the attribute property values
        // include the filter value
        return nodeDetails.some(
          item => item.toString().toLowerCase().includes(filterValue),
        );
      },
    );

    return filteredList;
  }

  /**
    * @param property to sort by
    */
  setSortBy = (property) => {
    if (this.state.activeSortOrder.property === property) {
      this.toggleSortDirection();
    } else {
      this.setState({
        activeSortOrder: {
          property,
          direction: 'asc',
        },
      });
    }
  };

  /**
    * changes direction of current sort
    */
  toggleSortDirection = () => {
    this.setState({
      activeSortOrder: {
        direction: this.state.activeSortOrder.direction === 'asc' ? 'desc' : 'asc',
        property: this.state.activeSortOrder.property,
      },
    });
  };

  render() {
    const {
      sortFields,
      ListComponent,
      listComponentProps,
      items,
    } = this.props;

    const sorter = sortOrder([this.state.activeSortOrder]);
    const sortedNodes = this.getFilteredList(sorter(items))
      .slice(0, 20); // TODO: until results list can render long lists

    return (
      <div className="list-select">
        <div className="list-select__sort">
          { sortFields && sortFields.map(sortField => (
            <Button
              color={this.state.activeSortOrder.property === sortField.variable ? 'primary' : 'white'}
              key={sortField.variable}
              onClick={() => this.setSortBy(sortField.variable)}
            >
              {(sortField.label || sortField.variable) + this.getDirection(sortField.variable)}
            </Button>
          ))}
          <input
            className="list-select__filter"
            type="search"
            placeholder="Filter"
            onChange={this.onFilterChange}
            value={this.state.filterValue}
          />
        </div>
        <ListComponent
          {...listComponentProps}
          items={sortedNodes}
        />
      </div>
    );
  }
}

FilterableListWrapper.propTypes = {
  initialSortOrder: PropTypes.array,
  items: PropTypes.array.isRequired,
  allowFiltering: PropTypes.bool,
  sortFields: PropTypes.array,
  ListComponent: PropTypes.func.isRequired,
  listComponentProps: PropTypes.shape({
  }).isRequired,
};

FilterableListWrapper.defaultProps = {
  initialSortOrder: [{
    property: '',
    direction: 'asc',
  }],
  allowFiltering: true,
  sortFields: [],
};

export default FilterableListWrapper;
