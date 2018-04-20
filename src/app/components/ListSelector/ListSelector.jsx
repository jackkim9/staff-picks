import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ListFilter from './ListFilter.jsx';
import config from '../../../../appConfig';
import BookActions from '../../../app/actions/BookActions.js';

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
    this.props.router.push({ pathname: url });
  }

  /**
   * updateBookStore(picks = {}, filters = [], selectedFilters = [])
   * Updates BookStore by BookActions based on latest client side API response
   * @param {object} picks
   * @param {string} currentSeason
   * @param {string} listType
   * @param {array} filters
   * @param {array} selectedFilters
   */
  updateBookStore(
    picks = {},
    currentSeason = '',
    listType = 'staff-picks',
    filters = [],
    selectedFilters = []
  ) {
    BookActions.updatePicks(picks);
    BookActions.updateCurrentSeason(currentSeason);
    BookActions.updateFilters(filters);
    BookActions.setSelectableFilters(selectedFilters);
    BookActions.updateListType(listType);
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

    // this function will be replaced by submitting to endpoint
    axios.get(`${config.baseApiUrl}${submitValue}`)
      .then(response => {
        // Catches the error from API, and update BookStore back to the default
        if (response.data.statusCode >= 400) {
          this.updateBookStore();
          console.log(
            `API error with status code ${response.data.statusCode}: ${response.data.errorMessage}`
          );
          // Leads the user to the 404 page
          this.updateLocation('/books-music-dvds/recommendations/staff-picks/404');
        } else {
          // For valid API response, updates BookStore for the new list
          this.updateBookStore(
            response.data.currentPicks,
            submitValue,
            'staff-picks'
          );
          // Updates and transit to the match URL
          this.updateLocation(
            `/books-music-dvds/recommendations/staff-picks/${submitValue}`
          );
        }
      })
      .catch(error => {
        // Catches the internal server error, and update BookStore back to the default
        this.updateBookStore();
        const errorResponse = error.response ?
          error.response : { statusText: 'Undefined error', status: 500 };
        const errorStatusText = errorResponse.statusText;
        const errorStatus = errorResponse.status;

        console.log(
          `Internal server error with status code ${errorStatus}: ` +
          `${errorStatusText}`
        );
        // Leads the user to the 404 page
        this.updateLocation('/books-music-dvds/recommendations/staff-picks/404');
      });
  }

  /**
   * handleSeasonChange(e)
   * Triggers to submit requests when the selected value changed on the season or audience lists
   * @param {DOM event} e
   */
  handleSeasonChange(e) {
    this.submitFormRequest(e.target.value);
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
            }
          }
        />
      );
    }

    return null;
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
  router: PropTypes.object,
};

ListSelector.defaultProps = {
};

export default ListSelector;
