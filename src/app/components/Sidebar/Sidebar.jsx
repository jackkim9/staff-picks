import React from 'react';
import PropTypes from 'prop-types';
import { LeftWedgeIcon } from '@nypl/dgx-svg-icons';

import BookFilters from '../BookFilters/BookFilters';
import ListSelector from '../ListSelector/ListSelector';
import config from '../../../../appConfig';

// This data is a temporary dummy data for creating the season list
const fieldsetProps = {
  season: {
    fieldsetName: 'season',
    currentValue: '',
    options: [
      { name: '2018 Winter', value: '2018-01', disabled: false },
      { name: '2017 Fall', value: '2017-09', disabled: true },
      { name: '2017 Summer', value: '2017-06', disabled: true },
      { name: '2017 Spring', value: '2017-04', disabled: true },
      { name: '2017 Winter', value: '2017-01', disabled: false },
    ],
  },
  audience: {
    fieldsetName: 'audience',
    currentValue: '',
    options: [
      { name: 'Adult', value: 'Adult', disabled: false },
      { name: 'Teen', value: 'YA', disabled: false },
      { name: 'Children', value: 'Children', disabled: false },
    ],
  },
};

const Sidebar = (props) => {
  const updateCurrentListSelectorValue = (data) => {
    fieldsetProps.season.currentValue = data.currentSeason;
    fieldsetProps.audience.currentValue = data.currentAudience;

    return fieldsetProps;
  };

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

  const renderListSelector = (data) =>
    <ListSelector
      fieldsetProps={data}
      isJsEnabled={props.isJsEnabled}
    />;

  return (
    <div className="sidebar nypl-column-one-quarter">
      <nav aria-label="Breadcrumbs">
        <a href={config.recommendationsLink.url} className="back-link">
          <LeftWedgeIcon ariaHidden />
          <span className="replaced-text visuallyHidden">Return to </span>
          {config.recommendationsLink.label}
        </a>
      </nav>
      {renderListSelector(updateCurrentListSelectorValue(props))}
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
  selectedFilters: PropTypes.arrayOf(PropTypes.object),
  picksCount: PropTypes.number,
};

Sidebar.defaultProps = {
  filters: [],
  selectableFilters: [],
  setSelectedFilter: () => {},
  clearFilters: () => {},
  isJsEnabled: false,
  selectedFilters: [],
  picksCount: 0,
};

export default Sidebar;
