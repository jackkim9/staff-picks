import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import BookList from '../BookList/BookList';
import Sidebar from '../Sidebar/Sidebar';
import utils from '../../utils/utils';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectableFilters: this.props.selectableFilters,
      selectedFilters: [],
      picks: this.props.currentPicks.picks && this.props.currentPicks.picks.length ?
        this.props.currentPicks.picks : [],
    };

    this.setSelectedFilter = this.setSelectedFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentWillReceiveProps() {
    // Update the props to reflect the latest updates from client side API responses
    this.setState({
      selectableFilters: this.props.selectableFilters,
      selectedFilters: [],
      picks: this.props.currentPicks.picks && this.props.currentPicks.picks.length ?
        this.props.currentPicks.picks : [],
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
      return picks || [];
    }

    return picks.filter((book) => {
      // Get the pick's tags in an ID readable array
      const tagArray = utils.getPickTags(book);
      // Get the array of selected tags found in the book item
      const inSelectedFilter = utils.getSelectedTags(tagArray, selectedFilters);

      if (inSelectedFilter.length &&
          (inSelectedFilter.length === selectedFilters.length)) {
        return book;
      }

      return undefined;
    });
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

    const picks = this.getNewPickSet(this.props.currentPicks.picks, selectedFilters);
    const selectableFilters = utils.getSelectableTags(picks);

    this.setState({
      selectableFilters,
      picks,
      selectedFilters,
    });
  }

  /**
   * clearFilters()
   * Reset the list of picks and set the list of filters back to its initial state.
   * @param {object} ref
   */
  clearFilters(ref) {
    const selectedFilters = [];
    const picks = this.getNewPickSet(this.props.currentPicks.picks, selectedFilters);
    const selectableFilters = utils.getSelectableTags(picks);

    utils.trackPicks('Clear Filters', 'Clicked');

    if (ref) {
      ReactDOM.findDOMNode(ref).focus();
    }

    this.setState({
      selectableFilters,
      picks,
      selectedFilters,
    });
  }

  /**
   * extractAudienceGroup(picks, audience)
   * Picks up the items from the selected age/audience group
   * @param {array} picks
   * @param {string} audience
   */
  extractAudienceGroup(picks, audience) {
    console.log(this.props.listType);

    // Only applies the check for staff-picks lists
    if (this.props.listType !== 'staff-picks') {
      // skips the checks and returns the original picks
      return picks;
    }

    const audienceGroup = [];

    if (Array.isArray(picks) && picks.length) {
      picks.map((item) => {
        if (item.ageGroup === audience) {
          audienceGroup.push(item);
        }
      });
    }

    return audienceGroup;
  }

  render() {
    return (
      <div className="nypl-row">
        <Sidebar
          filters={this.props.filters}
          selectableFilters={this.state.selectableFilters}
          setSelectedFilter={this.setSelectedFilter}
          clearFilters={this.clearFilters}
          isJsEnabled={this.props.isJsEnabled}
          selectedFilters={this.state.selectedFilters}
          picksCount={this.state.picks.length}
          currentSeason={this.props.currentSeason}
          currentAudience={this.props.currentAudience}
        />

        <BookList
          picks={this.extractAudienceGroup(this.state.picks, this.props.currentAudience)}
          isJsEnabled={this.props.isJsEnabled}
          listType={this.props.params.type}
        />
      </div>
    );
  }
}

Main.propTypes = {
  filters: PropTypes.array,
  selectableFilters: PropTypes.array,
  currentPicks: PropTypes.object,
  isJsEnabled: PropTypes.bool,
  params: PropTypes.object,
  listType: PropTypes.string,
  currentSeason: PropTypes.string,
  currentAudience: PropTypes.string,
};

Main.defaultProps = {
  filters: [],
  selectableFilters: [],
  currentPicks: {},
  isJsEnabled: false,
  params: { type: '' },
};

export default Main;
