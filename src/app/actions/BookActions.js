// ACTIONS
import alt from '../alt';

class Actions {
  updateListType(listType) {
    return listType;
  }

  updatePicks(picks) {
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

  setSelectableFilters(filters) {
    return filters;
  }
}

export default alt.createActions(Actions);
