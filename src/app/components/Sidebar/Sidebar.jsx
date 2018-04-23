import React from 'react';
import PropTypes from 'prop-types';
import { LeftWedgeIcon } from '@nypl/dgx-svg-icons';

import BookFilters from '../BookFilters/BookFilters';
import ListSelector from '../ListSelector/ListSelector';
import config from '../../../../appConfig';

const Sidebar = (props) => {
  /**
   * updateCurrentListSelectorValues(data)
   * Updates the current values in the passed down list options
   * @param {object} data
   */
  const updateCurrentListSelectorValues = (data) => {
    // Deep clones the object of props.listOptions to a new object so the update later will not
    // affect the original props.listOptions
    const listOptions = JSON.parse(JSON.stringify(props.listOptions));

    listOptions.season.currentValue = data.currentSeason;
    listOptions.audience.currentValue = data.currentAudience;

    return listOptions;
  };

  /**
   * renderBookFilters(shouldDisplay)
   * Renders book filters
   * @param {boolean} shouldDisplay
   */
  const renderBookFilters = (shouldDisplay) => {
    if (!shouldDisplay) {
      return null;
    }

    return (
      <BookFilters
        filters={props.filters}
        selectableFilters={props.selectableFilters}
        setSelectedFilter={props.setSelectedFilter}
        clearFilters={props.clearFilters}
        selectedFilters={props.selectedFilters}
        picksCount={props.picksCount}
      />
    );
  };

  /**
   * renderListSelector(data)
   * Renders list selector
   * @param {object} data
   */
  const renderListSelector = (data) =>
    <ListSelector fieldsetProps={data} isJsEnabled={props.isJsEnabled} />;

  return (
    <div className="sidebar nypl-column-one-quarter">
      <nav aria-label="Breadcrumbs">
        <a href={config.recommendationsLink.url} className="back-link">
          <LeftWedgeIcon ariaHidden />
          <span className="replaced-text visuallyHidden">Return to </span>
          {config.recommendationsLink.label}
        </a>
      </nav>
      {renderListSelector(updateCurrentListSelectorValues(props))}
      {renderBookFilters(props.isJsEnabled)}
    </div>
  );
};

Sidebar.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  selectableFilters: PropTypes.arrayOf(PropTypes.object),
  setSelectedFilter: PropTypes.func,
  clearFilters: PropTypes.func,
  isJsEnabled: PropTypes.bool,
  listOptions: PropTypes.object,
  selectedFilters: PropTypes.arrayOf(PropTypes.object),
  picksCount: PropTypes.number,
};

Sidebar.defaultProps = {
  filters: [],
  selectableFilters: [],
  setSelectedFilter: () => {},
  clearFilters: () => {},
  isJsEnabled: false,
  listOptions: {},
  selectedFilters: [],
  picksCount: 0,
};

export default Sidebar;
