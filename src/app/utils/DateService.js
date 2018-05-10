import {
  findKey as _findKey,
  contains as _contains,
} from 'underscore';
import config from '../../../appConfig';

const { seasons } = config;

/** monthOrSeason(month, year)
 * Returns either a month or season depending on the year, which is based on business rules
 * for Staff Picks data. After 2016, Staff Picks went from monthly lists to seasonal lists.
 * @param {number} month
 * @param {number} year
 * @returns {string}
 */
function monthOrSeason(month, year) {
  const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Return the key where the month is found in that key's array.
  const season = _findKey(seasons, s => _contains(s, monthsArr[month]));

  return (year >= 2016) ? season : monthsArr[month];
}

/**
 * matchListDate(dateStr, type)
 * Date based pattern matching for picks' routes.
 * @param {string} dateStr 
 * @param {string} type
 * @return {array|null}
 */
function matchListDate(dateStr, type = 'staff-picks') {
  let pattern = '';

  if (!dateStr && !type) {
    return null;
  }

  if (type !== 'staff-picks') {
    pattern = /(\d{4})/;
  } else {
    pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  }

  const validMatch = dateStr.match(pattern);

  return validMatch;
}

/**
 * staffPicksDate(dateStr)
 * Reads an string date that's specific to the Staff Picks API endpoint, such as "2018-01-01".
 * The string gets parsed to get either the correct month or season, and year.
 * @param {string} dateStr
 * @returns {object}
 */
function staffPicksDate(dateStr) {
  if (!dateStr) {
    return {
      month: '',
      year: '',
    };
  }

  const d = matchListDate(dateStr);
  const regexMonth = parseInt(d[1], 10) <= 2015 ? d[2] - 1 : d[2];
  const newDate = new Date(d[1], regexMonth, d[3]);
  const year = newDate.getFullYear();
  const month = monthOrSeason(newDate.getMonth(), year);

  return {
    month,
    year,
  };
}

/**
 * annualDate(dateStr)
 * Returns annual list identifier, four-digit year.
 * @param {string} dateStr
 * @return {object}
 */
function annualDate(dateStr) {
  if (!dateStr) {
    return { year: '' };
  }

  const annDate = matchListDate(dateStr, 'annual');
  const year = new Date(annDate[1], '01', '01').getFullYear();

  return { year };
}

export { staffPicksDate, annualDate, matchListDate };
