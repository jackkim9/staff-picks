/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FilterIcon,
  ResetIcon,
  LeftWedgeIcon,
} from '@nypl/dgx-svg-icons';
import { contains as _contains } from 'underscore';

import Filter from './Filter';
import utils from '../../utils/utils';

class BookFilters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Create an array data structure of filter objects.
      filters: utils.getFiltersMapping(this.props.filters),
      selectedFilters: this.props.selectedFilters,
      focusId: '',
      disabled: false,
      showFilters: false,
      timeout: undefined,
    };

    this.renderItems = this.renderItems.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.getFilterArray = this.getFilterArray.bind(this);
    this.setDisabled = this.setDisabled.bind(this);
    this.clearTimeout = this.clearTimeout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedFilters: nextProps.selectedFilters,
      filters: utils.getFiltersMapping(nextProps.filters),
    });
  }

  onClick(filterId, active) {
    this.props.setSelectedFilter(filterId, active);
    this.clearTimeout(this.state.timeout);

    const timeout = setTimeout(() => {
      utils.focusOnFirstAvailableElement(['sidebar-list-title', 'list-title']);
    }, 400);

    this.setState({
      filters: this.state.filters,
      focusId: filterId,
      disabled: active,
      timeout,
    });
  }

  /**
   * getFilterArray(selectableFilters, filters)
   * If the list of selectable filters is available, then we want the subset of all filters
   * that can be selected. A selectable filter is based on whether or not it is available
   * from a rendered pick item.
   * @param {array} selectableFilters
   * @param {array} filters
   */
  getFilterArray(selectableFilters, filters) {
    if (!selectableFilters.length) {
      return filters;
    }

    return filters.filter(filter => _contains(selectableFilters, filter.id));
  }


  setDisabled(disabled) {
    this.setState({ disabled });
  }

  toggleFilters() {
    utils.trackPicks('Mobile Filters', (this.state.showFilters ? 'Close' : 'Open'));
    this.setState({ showFilters: !this.state.showFilters });
  }

  /**
   * clearTimeout(id)
   * Clear the setTimeout that is currently active for filter in transition.
   * @param {string} id
   */
  clearTimeout(id) {
    clearTimeout(id);
  }

  /**
   * renderItems(filters)
   * Render the filter button list items.
   * @param {array} filter
   */
  renderItems(filters) {
    return filters.map((filter) => {
      const active = _contains(this.state.selectedFilters, filter.id);
      return (
        <Filter
          key={filter.id}
          filter={filter}
          onClick={this.onClick}
          focusId={this.state.focusId}
          active={active}
          disabled={this.state.disabled}
          setDisabled={this.setDisabled}
          clearTimeout={this.clearTimeout}
        />
      );
    });
  }

  render() {
    const { filters, showFilters } = this.state;
    const { selectableFilters } = this.props;

    if (!filters.length) {
      return null;
    }

    const filtersToRender = this.getFilterArray(selectableFilters, filters);
    const buttonAnimationClasses = showFilters ? 'rotate-up' : 'rotate-down';
    const filtersContainerDisplayClass = showFilters ? 'expand' : 'collapse';

    return (
      <div className="book-filters">
        <div className="book-filters-container">
          <h2><FilterIcon /> Filter by Tags</h2>
          <button
            aria-expanded={showFilters}
            onClick={this.toggleFilters}
            className="book-filters-toggleButton"
          >
            <LeftWedgeIcon ariaHidden className={buttonAnimationClasses} />
            <span className="visuallyHidden">
              {showFilters ? 'Collapse tag list' : 'Expand tag list'}
            </span>
          </button>
        </div>
        <div className={`book-filters-list ${filtersContainerDisplayClass}`}>
          <ul aria-label="Click to apply or remove tags.">
            {this.renderItems(filtersToRender)}
          </ul>
          {
            !!this.state.selectedFilters.length &&
              (
                <button
                  onClick={() => this.props.clearFilters()}
                  className="nypl-primary-button clear-button"
                  ref="clearFilters"
                >
                  <ResetIcon />
                  Clear All Filters
                </button>
              )
          }
        </div>
      </div>
    );
  }
}

BookFilters.propTypes = {
  filters: PropTypes.array,
  selectableFilters: PropTypes.array,
  setSelectedFilter: PropTypes.func,
  clearFilters: PropTypes.func,
  selectedFilters: PropTypes.array,
};

BookFilters.defaultProps = {
  filters: [],
  selectableFilters: [],
  setSelectedFilter: () => {},
  clearFilters: () => {},
  selectedFilters: [],
};

export default BookFilters;
