import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import ListFilter from './ListFilter';
import config from '../../../../appConfig';
import BookActions from '../../../app/actions/BookActions';
import utils from '../../utils/utils';

class ListSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
  }

  /**
   * updateLocation(url)
   * Pushes a new location with the URL that the client side request should go to
   * @param {string} url
   */
  updateLocation(url) {
    this.context.router.push({ pathname: url });
  }

  /**
   * updateBookStore(data = {}, currentSeason, filters = [], selectedFilters = [])
   * Updates BookStore by BookActions based on latest client side API response
   * @param {object} data
   * @param {string} currentSeason
   * @param {array} filters
   * @param {array} selectedFilters
   */
  updateBookStore(
    data = {},
    currentSeason = '',
    filters = [],
    selectedFilters = [],
  ) {
    BookActions.updatePicksData(data.picksData);
    BookActions.updateCurrentSeason(currentSeason);
    BookActions.updateFilters(filters);
    BookActions.setSelectableFilters(selectedFilters);
  }

  /**
   * submitFormRequest(submitValue)
   * Submits the request for a new list to the internal server
   * @param {string} submitValue
   */
  submitFormRequest(submitValue) {
    // If no valid season option passed
    if (!submitValue) {
      console.log('No valid season input.');
      return;
    }
    const type = this.props.fieldsetProps.type;

    // this function will be replaced by submitting to endpoint
    axios.get(`${config.baseApiUrl}${type}/${submitValue}`)
      .then((response) => {
        // Catches the error from API, and update BookStore back to the default
        if (!response.status || response.status >= 400) {
          this.updateBookStore();
          console.log(
            `API error with status code ${response.status}: ${response.data.errorMessage}`
          );
          // Leads the user to the 404 page
          this.updateLocation(`${config.baseUrl}404`);
        } else {
          const data = response.data;
          const filters = utils.getAllTags(data.picksData.picks);
          // Get the subset of tags that the picks can be filtered by.
          const selectableFilters = utils.getSelectableTags(data.picksData.picks);

          // For valid API response, updates BookStore for the new list
          this.updateBookStore(
            data,
            submitValue,
            filters,
            selectableFilters,
          );
          // Updates and transit to the match URL
          const dataType = utils.getDataType(data.picksData.type, true);
          this.updateLocation(`${config.baseUrl}${dataType}/${submitValue}`);
          // Focuses on the title
          utils.focusOnFirstAvailableElement(['sidebar-list-title', 'list-title']);
        }
      })
      .catch((error) => {
        // Catches the internal server error, and update BookStore back to the default
        this.updateBookStore();
        const errorResponse = error.response ?
          error.response : { statusText: 'Undefined error', status: 500 };
        const errorStatusText = errorResponse.statusText;
        const errorStatus = errorResponse.status;

        console.log(`Internal server error with status code ${errorStatus}: ` +
          `${errorStatusText}`);
        // Leads the user to the 404 page
        this.updateLocation(`${config.baseUrl}404`);
      });
  }

  /**
   * handleSeasonChange(e)
   * Triggers to submit requests when the selected value changed on the season or audience lists
   * @param {DOM event} e
   */
  handleSeasonChange(e) {
    this.submitFormRequest(e.target.value);

    // Adds to GA event
    if (!this.props.fieldsetProps.audience) {
      utils.trackPicks('Lists', `${e.target.value}`);
    } else {
      utils.trackPicks('Lists', `${e.target.value} - ${this.props.fieldsetProps.audience}`);
    }
  }

  /**
   * renderFieldset(fieldsetProps)
   * Renders the fieldset for a select input and its options
   * @param {object} fieldsetProps
   */
  renderFieldset(fieldsetProps) {
    if (!fieldsetProps) {
      return null;
    }

    const listType = fieldsetProps.fieldsetName;

    // Returns eifferent fieldsets based on different list types.
    // Now we only have season and audience.
    // Any types aside these two shouldn't be displayed.
    if (listType === 'season') {
      return (
        <ListFilter
          fieldsetProps={fieldsetProps}
          handleChange={this.handleSeasonChange}
        />
      );
    } else if (listType === 'audience') {
      return (
        <ListFilter
          fieldsetProps={fieldsetProps}
          handleChange={
            (e) => {
              BookActions.updateCurrentAudience(e.target.value);
              // Focuses on the title
              utils.focusOnFirstAvailableElement(['sidebar-list-title', 'list-title']);

              // Adds to GA event
              utils.trackPicks('Lists', `${this.props.fieldsetProps.season} - ${e.target.value}`);
            }
          }
        />
      );
    }

    return null;
  }

  render() {
    const isJsEnabled = this.props.isJsEnabled;
    const hiddenClass = (isJsEnabled) ? 'visuallyHidden' : 'no-js';

    return (
      <form action={`${config.baseApiUrl}post`} method="post">
        {this.renderFieldset(this.props.fieldsetProps.audience)}
        {this.renderFieldset(this.props.fieldsetProps.season)}
        <input
          type="hidden"
          name="type"
          value={this.props.fieldsetProps.type}
          className={hiddenClass}
        />
        <input
          type="submit"
          value="Select List"
          className={hiddenClass}
          tabIndex={isJsEnabled ? -1 : 0}
        />
      </form>
    );
  }
}

ListSelector.propTypes = {
  fieldsetProps: PropTypes.object,
  isJsEnabled: PropTypes.bool,
};

ListSelector.defaultProps = {
};

ListSelector.contextTypes = {
  router: PropTypes.object,
};

export default ListSelector;
