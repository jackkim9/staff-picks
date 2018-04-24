import nyplApiClient from '../helper/nyplApiClient.js';
import config from '../../../appConfig';
import platformConfig from '../../../platformConfig';
import modelListOptions from '../../app/utils/ModelListOptionsService';

/* nyplApiClientGet(endpoint)
 * The function that wraps nyplApiClient for GET requests.
 * @param {string} endpoint
 */
const nyplApiClientGet = (endpoint) =>
  nyplApiClient().then(client => client.get(endpoint, { cache: false }));

/* currentMonthData
 * Gets the default/latest monthly staff pick list.
 * It calls '/book-lists?type=staff-picks' to get all the available list options first.
 */
function currentMonthData(req, res, next) {
  const listOptions = config.staffPicksListOptions;
  let seasonListOptions = [];
  let latestSeason = '';

  // The first request to get all the available list options
  nyplApiClientGet(platformConfig.endpoints.allStaffPicksLists)
    .then(data => {
      // Models the options based on the data returned
      const modeledOptionObject = modelListOptions(data, 'staff-picks');

      seasonListOptions = modeledOptionObject.options;
      latestSeason = modeledOptionObject.latestOption;

      // Updates default season list options with API response
      listOptions.season.options = seasonListOptions;

      // Calls the latest list
      return nyplApiClientGet(`${platformConfig.endpoints.staffPicksPath}${latestSeason}`);
    })
    .then(data => {
      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: data,
          selectableFilters: [],
          isJsEnabled: false,
          listOptions,
          currentSeason: latestSeason,
          currentAudience: 'Adult',
        },
        pageTitle: '',
        metaTags: [],
      };

      next();
    })
    .catch(error => {
      console.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      res.redirect('/books-music-dvds/recommendations/404');

      return;
    });
}

/* selectMonthData
 * Get a specific month's or season's staff pick list.
* It calls '/book-lists?type=staff-picks' to get all the available list options first.
 */
function selectMonthData(req, res, next) {
  const listOptions = config.staffPicksListOptions;
  let seasonListOptions = [];
  let latestSeason = '';

  // Checks if the URL input fits season's convention
  const seasonMatches = req.params.month.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
  // Default audience list is the adult list
  let audience = 'Adult';
  let isValidAudience = true;
  let requestedSeason = '';

  // Checks if req.query.audience exists
  if (req.query.audience) {
    // If so, checks if it equals to one of the three values
    if (['Adult', 'YA', 'Children'].includes(req.query.audience)) {
      // If so, updates the selected audience list value
      audience = req.query.audience;
    } else {
      // Or set it is an invalid audience query
      isValidAudience = false;
    }
  }

  if (!seasonMatches || !isValidAudience) {
    console.error('Status Code: 400, Error Message: Invalid season or audience.');

    res.redirect('/books-music-dvds/recommendations/404');

    return;
  } else {
  // If the param fits season's convention, constructs the request param
  requestedSeason = seasonMatches[0];

  // The first request to get all the available list options
  nyplApiClientGet(platformConfig.endpoints.allStaffPicksLists)
    .then(data => {
      // Models the options based on the data returned
      const modeledOptionObject = modelListOptions(data, 'staff-picks');

      seasonListOptions = modeledOptionObject.options;
      latestSeason = modeledOptionObject.latestOption;

      // Updates default season list options with API response
      listOptions.season.options = seasonListOptions;

      // Calls the selected list
      return nyplApiClientGet(`${platformConfig.endpoints.staffPicksPath}${requestedSeason}`);
    })
    .then(data => {
      // If error returned from the endpoint
      if (data.statusCode >= 400) {
        console.error(`Status Code: ${data.statusCode}, Error Message: ${data.error}`);

        res.redirect('/books-music-dvds/recommendations/404');

        return;
      }

      // Uodate the option lists' default values by the request params
      listOptions.season.currentValue = requestedSeason;
      listOptions.audience.currentValue = audience;

      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: data,
          selectableFilters: [],
          isJsEnabled: false,
          listOptions,
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

      res.redirect('/books-music-dvds/recommendations/404');

      return;
    });
  }
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
    console.error(
      `Form data of season or audience is undefined. season: ${season}, audience: ${audience}`
    );

    res.redirect('/books-music-dvds/recommendations/404');
  } else {
    // Redirects and calls selectMonthData() to make server side request for the season/audience list
    res.redirect(
      `${config.baseMonthUrl}${season}${audienceQuery}`
    );
  }
}

export default {
  currentMonthData,
  selectMonthData,
  selectClientMonthData,
  selectMonthDataFormPost,
};
