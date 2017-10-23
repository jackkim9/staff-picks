/* currentMonthData
 * Get the default/latest monthly staff pick list.
 */
function currentMonthData(req, res, next) {
  res.locals.data = {
    BookStore: {
      filters: [],
      currentMonthPicks: {},
    },
  };
  next();
}

/* selectMonthData
 * Get a specific month's or season's staff pick list.
 */
function selectMonthData(req, res, next) {
  res.locals.data = {
    BookStore: {
      filters: [],
      currentMonthPicks: {},
    },
  };
  next();
}

export default {
  currentMonthData,
  selectMonthData,
};