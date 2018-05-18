/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import { findWhere as _findWhere } from 'underscore';

import BookList from '../BookList/BookList';
import Sidebar from '../Sidebar/Sidebar';
import utils from '../../utils/utils';
import { staffPicksDate, annualDate } from '../../utils/DateService';
import appConfig from '../../../../appConfig';
import BookActions from '../../actions/BookActions';
import TopHeading from '../TopHeading/TopHeading';

class Main extends React.Component {
  constructor(props) {
    super(props);

    const picksData = this.props.picksData;
    const picks =
      this.filterByAudience(picksData.picks, this.props.currentAudience, picksData.type);

    this.state = {
      selectedFilters: [],
      picks,
    };

    this.setSelectedFilter = this.setSelectedFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.getPicksInfo = this.getPicksInfo.bind(this);
    this.getNewPickSet = this.getNewPickSet.bind(this);
    this.filterByAudience = this.filterByAudience.bind(this);
    this.getCount = this.getCount.bind(this);
  }

  componentDidMount() {
    const picksData = this.props.picksData;
    const hash = this.props.location && this.props.location.hash ?
      (this.props.location.hash).substr(1) : '';
    if (hash) {
      const pick = _findWhere(picksData.picks, { slug: hash });
      if (pick) {
        const age = pick && pick.ageGroup ? pick.ageGroup : 'Adult';
        const picks =
          this.filterByAudience(picksData.picks, age, picksData.type);

        BookActions.updateCurrentAudience(age);
        this.setState({ picks }, () => {
          setTimeout(() => {
            const elem = document.getElementById(hash);
            if (elem) {
              elem.scrollIntoView();
              elem.focus();
            }
          }, 800);
        });
      } else {
        this.context.router.push({ pathname: this.props.location.pathname });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const picksData = nextProps.picksData;
    const picks =
      this.filterByAudience(picksData.picks, nextProps.currentAudience, picksData.type);

    // Update the props to reflect the latest updates from client side API responses
    this.setState({
      selectedFilters: [],
      picks,
    });
  }

  /**
   * getNewPickSet(picks, selectedFilters)
   * Gets the new set of picks filtered by the selected tags.
   * @param {array} picks
   * @param {array} selectedFilters
   */
  getNewPickSet(picks, selectedFilters) {
    if (!selectedFilters || !selectedFilters.length) {
      const updatedPicks =
        this.filterByAudience(picks, this.props.currentAudience, 'staff-picks');
      return updatedPicks;
    }

    if (!Array.isArray(picks) || !picks.length) {
      return [];
    }

    return picks.filter((book) => {
      // Get the pick's tags in an ID readable array
      const tagArray = utils.getPickTags(book);
      // Get the array of selected tags found in the book item
      const inSelectedFilter = utils.getSelectedTags(tagArray, selectedFilters);

      return (inSelectedFilter.length && (inSelectedFilter.length === selectedFilters.length));
    });
  }

  /**
   * getPicksInfo(picksData, currentAudience)
   * Gets display information for a specific pick data set.
   * @param {object} picksData
   * @param {string} currentAudience
   */
  getPicksInfo(picksData, currentAudience) {
    if (!picksData) {
      return {};
    }

    const { date } = picksData;
    const { type } = picksData;
    const displayDate = type === 'staff-picks' ? staffPicksDate(date) : annualDate(date);

    return {
      displayDate,
      displayAge: appConfig.audienceMap[currentAudience || 'Adult'],
    };
  }

  /**
   * setSelectedFilter(filterId, active)
   * Adds or removes the selected filter's ID from the selectedFilters array which keeps track
   * of all active IDs. It then uses that array of IDs to filter down the list of
   * filters that are selectable.
   * @param {string} filterId
   * @param {boolean} active
   */
  setSelectedFilter(filterId, active) {
    let selectedFilters = [];

    if (active) {
      selectedFilters = this.state.selectedFilters.concat(filterId);
    } else {
      selectedFilters = this.state.selectedFilters.filter(id => id !== filterId);
    }

    let picks = this.getNewPickSet(this.props.picksData.picks, selectedFilters);

    picks = this.filterByAudience(picks, this.props.currentAudience, this.props.picksData.type);

    this.setState({
      picks,
      selectedFilters,
    });
  }

  /**
   * getCount(picksData = {})
   * Returns the count of the current set of picks.
   * @param {object} picksData
   */
  getCount() {
    const picks = this.state.picks;

    return (picks && picks.length) ? picks.length : 0;
  }

  /**
   * clearFilters()
   * Reset the list of picks and set the list of filters back to its initial state.
   * @param {string} id
   */
  clearFilters() {
    const selectedFilters = [];
    const picks = this.getNewPickSet(this.props.picksData.picks, selectedFilters);

    utils.trackPicks('Clear Filters', 'Clicked');

    this.setState({
      picks,
      selectedFilters,
    });

    setTimeout(() => {
      utils.focusOnFirstAvailableElement(['sidebar-list-title', 'list-title']);
    }, 400);
  }

  /**
   * filterByAudience(picks, audience, type)
   * Picks up the items from the selected age/audience group
   * @param {array} picks
   * @param {string} audience
   * @param {string} type
   */
  filterByAudience(picks, audience, type) {
    // Only applies the check for staff-picks lists
    if (type !== 'staff-picks') {
      // skips the checks and returns the original picks
      return picks || [];
    }

    const updatedPicks = [];

    if (Array.isArray(picks) && picks.length) {
      picks.forEach((item) => {
        if (item.ageGroup === audience) {
          updatedPicks.push(item);
        }
      });
    }

    return updatedPicks;
  }

  render() {
    const picksCount = this.getCount();
    return (
      <div>
        <TopHeading
          displayInfo={this.getPicksInfo(this.props.picksData, this.props.currentAudience)}
          displayType={this.props.picksData.type}
          picksCount={picksCount}
        />

        <div className="nypl-row">
          <Sidebar
            filters={this.props.filters}
            selectableFilters={utils.getSelectableTags(this.state.picks)}
            setSelectedFilter={this.setSelectedFilter}
            clearFilters={this.clearFilters}
            isJsEnabled={this.props.isJsEnabled}
            listOptions={this.props.listOptions}
            selectedFilters={this.state.selectedFilters}
            currentSeason={this.props.currentSeason}
            currentAudience={this.props.currentAudience}
            type={this.props.picksData.type}
          />

          <BookList
            picks={this.state.picks}
            isJsEnabled={this.props.isJsEnabled}
            displayType={this.props.picksData.type}
          />
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  filters: PropTypes.array,
  picksData: PropTypes.object,
  isJsEnabled: PropTypes.bool,
  listOptions: PropTypes.object,
  currentSeason: PropTypes.string,
  currentAudience: PropTypes.string,
  location: PropTypes.shape({
    hash: PropTypes.string,
    pathname: PropTypes.string,
  }),
};

Main.contextTypes = {
  router: PropTypes.object,
};

Main.defaultProps = {
  filters: [],
  picksData: {},
  isJsEnabled: false,
};

export default Main;
