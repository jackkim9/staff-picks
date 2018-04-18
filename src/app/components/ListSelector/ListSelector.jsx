import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ListFilter from './ListFilter.jsx';
import config from '../../../../appConfig';
import BookActions from '../../../app/actions/BookActions.js';
import {
  createHistory,
  useQueries,
  createMemoryHistory,
} from 'history';

/**
 * createAppHistory
 * Creates createHistory instance that supports both server side and client side rendering
 */
const createAppHistory = () => {
  if (typeof(window) !== 'undefined') {
    return useQueries(createHistory)();
  }

  return useQueries(createMemoryHistory)();
};

// createHistory() for update the URL and history with client side request
const history = createAppHistory();

class ListSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * updateHistory(url)
   * Updates the browsing history with the URL that the client side request should go to
   * @param {string} url
   */
  updateHistory(url) {
    history.push({ pathname: url });
  }

  /**
   * updateBookStore(picks = {}, filters = [], selectedFilters = [])
   * Updates BookStore by BookActions based on latest client side API response
   * @param {object} picks
   * @param {array} filters
   * @param {array} selectedFilters
   */
  updateBookStore(
    picks = {},
    currentSeason = '',
    currentAudience = 'adult',
    listType = 'staff-picks',
    filters = [],
    selectedFilters = []
  ) {
    BookActions.updatePicks(picks);
    BookActions.updateCurrentSeason(currentSeason);
    BookActions.updateCurrentAudience(currentAudience);
    BookActions.updateFilters(filters);
    BookActions.setSelectableFilters(selectedFilters);
    BookActions.updateListType(listType);
  }

  /**
   * submitFormRequest(listType, submitValue)
   * Submits the request for a new list to the internal server
   * @param {string} listType
   * @param {string} submitValue
   */
  submitFormRequest(listType, submitValue) {
    let seasonValue = this.props.fieldsetProps.season.currentValue;
    let audienceValue = this.props.fieldsetProps.audience.currentValue;

    if (listType === 'season') {
      seasonValue = submitValue;
    }

    if (listType === 'audience') {
      audienceValue = submitValue;
      audienceQuery = `?audience=${audienceValue}`;
    }

    // this function will be replaced by submiting to endpoint
    axios.get(`${config.baseApiUrl}${seasonValue}`)
      .then(response => {
        // Catch the error from API, and update BookStore back to the default
        if (response.data.statusCode >= 400) {
          this.updateBookStore();
          console.log(
            `API error with status code ${response.data.statusCode}: ${response.data.errorMessage}`
          );
          // Lead the user to the 404 page
          this.updateHistory('/books-music-dvds/recommendations/staff-picks/404');
        } else {
          // For valid API response, update BookStore for the new list
          this.updateBookStore(
            response.data.currentPicks,
            seasonValue,
            audienceValue,
            'staff-picks'
          );
          // Update and transit to the match URL
          this.updateHistory(
            `/books-music-dvds/recommendations/staff-picks/${seasonValue}-01/`
          );
        }
      })
      .catch(error => {
        // Catch the internal server error, and update BookStore back to the default
        this.updateBookStore();
        const errorResponse = error.response ?
          error.response : { statusText: 'Undefined error', status: 500 };
        const errorStatusText = errorResponse.statusText;
        const errorStatus = errorResponse.status;

        console.log(
          `Internal server error with status code ${errorStatus}: ` +
          `${errorStatusText}`
        );
        // Lead the user to the 404 page
        this.updateHistory('/books-music-dvds/recommendations/staff-picks/404');
      });
  }

  /**
   * handleChange(listType, e)
   * Triggers to submit requests when the selected value changed on the season or audience lists
   * @param {string} listType
   * @param {DOM event} e
   */
  handleChange(listType, e) {
    this.submitFormRequest(listType, e.target.value);
  }

  /**
   * renderFieldset(fieldsetProps)
   * Renders the fieldset for a select input and its options
   * @param {object} fieldsetProps
   */
  renderFieldset(fieldsetProps) {
    if (!fieldsetProps.options.length) {
      return null;
    }

    const listType = fieldsetProps.fieldsetName;

    return (
      <ListFilter
        fieldsetProps={fieldsetProps}
        handleChange={this.handleChange}
        listType={listType}
      />
    );
  }

  render() {
    const visuallyHidden = (this.props.isJsEnabled) ? 'visuallyHidden' : '';

    return (
      <form action={`${config.baseApiUrl}`} method="post">
        {this.renderFieldset(this.props.fieldsetProps.season)}
        {this.renderFieldset(this.props.fieldsetProps.audience)}
        <input type="submit" value="Select List" className={visuallyHidden} />
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

export default ListSelector;
