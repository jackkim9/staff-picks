// ACTIONS
import alt from '../alt';

class Actions {
  updatePicksData(picks) {
    return picks;
  }

  updateFilters(filters) {
    return filters;
  }

  updateCurrentSeason(season) {
    return season;
  }

  updateCurrentAudience(audience) {
    return audience;
  }

  setIsJsEnabled(bool) {
    return bool;
  }

  setListOptions(listOptions) {
    return listOptions;
  }

  setSelectableFilters(filters) {
    return filters;
  }
}

export default alt.createActions(Actions);
