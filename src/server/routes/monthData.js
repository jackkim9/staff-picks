import nyplApiClient from '../helper/nyplApiClient.js';
import config from '../../../appConfig';

const getLatestSeason = () => {
  // this function should return the latest season by current month
  return '';
};

const nyplApiClientGet = (endpoint) =>
  nyplApiClient().then(client => client.get(endpoint, { cache: false }));

/* currentMonthData
 * Get the default/latest monthly staff pick list.
 */
function currentMonthData(req, res, next) {
  // should get the latest list from the function getLatestSeason()
  // It will always be adult for default audience list
  // After the API is ready, we can specify the audience query below
  nyplApiClientGet('/book-lists/staff-picks/2018-03-01')
    .then(data => {
      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: data,
          selectableFilters: [],
          isJsEnabled: false,
          currentSeason: getLatestSeason(),
          currentAudience: 'Adult',
        },
        pageTitle: '',
        metaTags: [],
      };

      next();
    })
    .catch(error => {
      console.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: {},
          selectableFilters: [],
          isJsEnabled: false,
          currentSeason: getLatestSeason(),
          currentAudience: 'Adult',
        },
      };

      next();
    });
}

/* selectMonthData
 * Get a specific month's or season's staff pick list.
 */
function selectMonthData(req, res, next) {
  // Checks if the URL input fits season's convention
  const seasonMatches = req.params.month.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
  // Default audience list is the adult list
  let audience = 'Adult';
  let requestedSeason = '';

  // Checks if req.query.audience exists and equals to one of the three values
  if (['Adult', 'YA', 'Children'].includes(req.query.audience)) {
    // If so, updates the selected audience list value
    audience = req.query.audience;
  }

  // If the param does not fit season's convention, throws an error
  if (!seasonMatches) {
    console.error('Status Code: 400, Error Message: Invalid season.');

    res.locals.data = {
      BookStore: {
        listType: 'staff-picks',
        filters: [],
        currentPicks: {},
        selectableFilters: [],
        isJsEnabled: false,
        currentSeason: getLatestSeason(),
        currentAudience: 'Adult',
      },
    };

    next();
  } else {
    // If the param fits season's convention, constructs the request param
    requestedSeason = seasonMatches[0];
  }

  // Now the audience query seems to have no influence to the API,
  // as it will always throw the adult lists
  // But we should show the audience we choose on the URL and selected value on the list
  nyplApiClientGet(`/book-lists/staff-picks/${requestedSeason}`)
    .then(data => {
      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: data,
          selectableFilters: [],
          isJsEnabled: false,
          currentSeason: requestedSeason,
          currentAudience: audience,
        },
        pageTitle: '',
        metaTags: [],
      };

      next();
    })
    .catch(error => {
      console.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: {},
          selectableFilters: [],
          isJsEnabled: false,
          currentSeason: getLatestSeason(),
          currentAudience: 'Adult',
        },
      };

      next();
    });
}

/**
 * selectClientMonthData(req, res, next)
 * Gets a specific month's or season's staff pick list on the client side.
 */
function selectClientMonthData(req, res) {
  const seasonMatches = req.params.month.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);

  if (!seasonMatches) {
    console.error('Status Code: 400, Error Message: Invalid season.');

    res.json({
      statusCode: 400,
      errorMessage: 'Invalid season.',
    });
  }

  nyplApiClientGet(`/book-lists/staff-picks/${seasonMatches[0]}`)
    .then(data => {
      res.json({
        title: data.title,
        date: data.date,
        currentPicks: {
          picks: data.picks,
        },
      });
    })
    .catch(error => {
      console.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      res.json({
        statusCode: error.statusCode || 500,
        errorMessage: error.code,
      });
    });
}

/**
 * selectClientMonthDataPost(req, res, next)
 * Handles the requests from the form submit button (when no JS).
 * It redirects to the route to execute the function for server side requesting.
 */
function selectMonthDataFormPost(req, res) {
  const season = (req.body.season) ? `${req.body.season}` : '';
  const audience = req.body.audience;
  const audienceQuery = audience ? `?audience=${audience}` : '';

  if (!season || !audience) {
    console.log(
      `Form data of season or audience is undefined. season: ${season}, audience: ${audience}`
    );
  }

  // Redirects and calls selectMonthData() to make server side request for the season/audience list
  res.redirect(
    `${config.baseMonthUrl}${season}${audienceQuery}`
  );
}

export default {
  currentMonthData,
  selectMonthData,
  selectClientMonthData,
  selectMonthDataFormPost,
};
