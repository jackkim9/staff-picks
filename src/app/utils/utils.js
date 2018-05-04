import {
  union as _union,
  contains as _contains,
  each as _each,
  sortBy as _sortBy,
} from 'underscore';
import { gaUtils } from 'dgx-react-ga';
import {
  createHistory,
  useQueries,
  createMemoryHistory,
} from 'history';

function Utils() {
  /**
   * createAppHistory
   * Create a history in the browser or server that coincides with react-router.
   */
  this.createAppHistory = () => {
    if (typeof window !== 'undefined') {
      return useQueries(createHistory)();
    }

    return useQueries(createMemoryHistory)();
  };

  /**
   * trackPicks(action, label)
   * Track a GA click event, where action and label come from
   * the higher level function call from _trackEvent().
   *
   * @param {string} action Action for GA event.
   * @param {string} label Label for GA event.
   */
  this.trackPicks = gaUtils.trackEvent('Staff Picks');

  /**
   * getPickTags(book)
   * Return an array of the pick's tags, lowercased and with a hyphen to easily
   * use as a class or an ID.
   *
   * @param {object} book
   */
  this.getPickTags = (book) => {
    if (!book || !(book.tags && book.tags.length)) {
      return [];
    }
    return book.tags.map(tag => tag.toLowerCase().split(' ').join('-'));
  };

  /**
   * getSelectedTags(tagArray, selectedFilters)
   * Return an array of the filters in a pick's tagArray if the selectedFilters is found.
   *
   * @param {array} tagArray
   * @param {array} selectedFilters
   */
  this.getSelectedTags = (tagArray, selectedFilters) => {
    const selectedTags = [];
    _each(tagArray, (bookTag) => {
      if (_contains(selectedFilters, bookTag)) {
        selectedTags.push(bookTag);
      }
    });

    return selectedTags;
  };

  /**
   * getSelectableTags(picks)
   * Get the subset of tags that can be selected based on the subset of picks.
   *
   * @param {array} picks
   */
  this.getSelectableTags = (picks) => {
    let selectableFilters = [];

    _each(picks, (book) => {
      const tagArray = this.getPickTags(book);
      selectableFilters = _union(selectableFilters, tagArray);
    });

    return selectableFilters;
  };

  /**
   * getAllTags(picks)
   * Get all the tags from a pick list without modifying the tag's name,
   * and sorts them alphabetically.
   *
   * @param {array} picks
   */
  this.getAllTags = (picks) => {
    let tags = [];

    _each(picks, (pick) => {
      const pickTags = pick.tags && pick.tags.length ? pick.tags : [];
      tags = _union(tags, pickTags);
    });

    return _sortBy(tags, tag => tag);
  };

  /**
   * capitalize(str)
   * capitalizes a string
   * @param {string} str
   */
  this.capitalize = (str) =>
    str.replace(/^\w/, (chr) => chr.toUpperCase());

  /**
   * focusOnFirstAvailableElement(elementIds)
   * Jumps the focus to the first available HTML element that is listed in an array of element IDs.
   * @param {array} elementIds
   */
  this.focusOnFirstAvailableElement = (elementIds) => {
    if (!Array.isArray(elementIds) || !elementIds.length) {
      return;
    }

    // Finds the element that meets the condition by its ID
    const IdOfElementToBeFocused = elementIds.find((elementId) => {
      const elementDOM = document.getElementById(elementId);
      const isDisplay = elementDOM ?
        window.getComputedStyle(elementDOM).getPropertyValue('display') !== 'none' : false;

      // Checks if the element exists and is displayed
      // If so, return the ID of the element
      return elementDOM && isDisplay;
    });

    // Checks if any element is returned as IdOfElementToBeFocused
    if (IdOfElementToBeFocused) {
      document.getElementById(IdOfElementToBeFocused).focus();
    }
  };
}

export default new Utils();
