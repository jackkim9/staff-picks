import nyplApiClient from '../helper/nyplApiClient.js';
import config from '../../../appConfig';
import platformConfig from '../../../platformConfig';

/* nyplApiClientGet = (endpoint)
 * The functions that wraps nyplApiClient for GET requests.
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
      if (Array.isArray(data) && data.length) {
        data.map((list) => {
          // We have to map the value and the season name here
          const option = { name: 'somthing', value: list.date };

          seasonListOptions.push(option);
        });

        // Reverses the order of the options as the data now is from oldest to newest
        // However, a more thorough check to compare the values might be needed
        seasonListOptions = seasonListOptions.reverse();
        // Sets the latest season list
        latestSeason = seasonListOptions[0].value;
      }

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

      res.locals.data = {
        BookStore: {
          listType: 'staff-picks',
          filters: [],
          currentPicks: {},
          selectableFilters: [],
          isJsEnabled: false,
          listOptions,
          currentSeason: latestSeason(),
          currentAudience: 'Adult',
        },
      };

      next();
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
  let requestedSeason = '';

  // Checks if req.query.audience exists and equals to one of the three values
  if (['Adult', 'YA', 'Children'].includes(req.query.audience)) {
    // If so, updates the selected audience list value
    audience = req.query.audience;
  }

  // The first request to get all the available list options
  nyplApiClientGet(platformConfig.endpoints.allStaffPicksLists)
    .then(data => {
      if (Array.isArray(data) && data.length) {
        data.map((list) => {
          // We have to map the value and the season name here
          const option = { name: 'somthing', value: list.date };

          seasonListOptions.push(option);
        });

        // Reverses the order of the options as the data now is from oldest to newest
        // However, a more thorough check to compare the values might be needed
        seasonListOptions = seasonListOptions.reverse();
        // Sets the latest season list
        latestSeason = seasonListOptions[0].value;
      }

      // Updates default season list options with API response
      listOptions.season.options = seasonListOptions;

      // we handle bad season input here
      if (!seasonMatches) {
        console.error('Status Code: 400, Error Message: Invalid season.');

        res.locals.data = {
          BookStore: {
            listType: 'staff-picks',
            filters: [],
            currentPicks: {},
            selectableFilters: [],
            isJsEnabled: false,
            listOptions,
            currentSeason: latestSeason,
            currentAudience: 'Adult',
          },
        };

        next();
      } else {
        // If the param fits season's convention, constructs the request param
        requestedSeason = seasonMatches[0];
      }

      // Calls the selected list
      return nyplApiClientGet(`${platformConfig.endpoints.staffPicksPath}${requestedSeason}`);
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
          listOptions,
          currentSeason: latestSeason,
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
