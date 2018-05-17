import nyplApiClient from '../helper/nyplApiClient';
import config from '../../../appConfig';
import logger from '../../../logger';

import utils from '../../app/utils/utils';
import platformConfig from '../../../platformConfig';
import modelListOptions from '../../app/utils/ModelListOptionsService';
import { matchListDate } from '../../app/utils/DateService';

const STAFF_PICKS = 'staff-picks';

/* nyplApiClientGet(endpoint)
 * The function that wraps nyplApiClient for GET requests.
 * @param {string} endpoint
 */
const nyplApiClientGet = endpoint =>
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
    .then((data) => {
      // Models the options based on the data returned
      const modeledOptionObject = modelListOptions(data, STAFF_PICKS);

      seasonListOptions = modeledOptionObject.options;
      latestSeason = modeledOptionObject.latestOption;

      // Updates default season list options with API response
      listOptions.season.options = seasonListOptions;

      // Calls the latest list
      return nyplApiClientGet(`${platformConfig.endpoints.staffPicksPath}${latestSeason}`);
    })
    .then((data) => {
      const filters = utils.getAllTags(data.picks);
      // Get the subset of tags that the picks can be filtered by.
      const selectableFilters = utils.getSelectableTags(data.picks);

      res.locals.data = {
        BookStore: {
          filters,
          picksData: data,
          selectableFilters,
          isJsEnabled: false,
          listOptions,
          currentSeason: latestSeason,
          currentAudience: 'Adult',
        },
        pageTitle: config.pageTitle[STAFF_PICKS],
        metaTags: config.metaTags[STAFF_PICKS],
      };

      next();
    })
    .catch((error) => {
      logger.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      return res.redirect(`${config.baseUrl}/404`);
    });
}

/* selectMonthData
 * Get a specific month's or season's staff pick list.
* It calls '/book-lists?type=staff-picks' to get all the available list options first.
 */
function selectMonthData(req, res, next) {
  const listOptions = config.staffPicksListOptions;
  let seasonListOptions = [];
  const dateRequest = req.params.time;

  // Redirects older three part dates in URLs to the new two part date before validation.
  if (dateRequest && /^(\d{4})-(\d{2})-(\d{2})$/.test(dateRequest)) {
    const newPath = req.url.replace(/(\d{4})-(\d{2})-(\d{2})/, utils.toMonthAndYear);
    return res.redirect(newPath);
  }

  // Checks if the URL input fits season's convention
  const seasonMatches = matchListDate(dateRequest);
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
    logger.error('Status Code: 400, Error Message: Invalid season or audience.');

    return res.redirect(`${config.baseUrl}/404`);
  }

  // If the param fits season's convention, constructs the request param
  requestedSeason = seasonMatches[0];

  // The first request to get all the available list options
  nyplApiClientGet(platformConfig.endpoints.allStaffPicksLists)
    .then((data) => {
      // Models the options based on the data returned
      const modeledOptionObject = modelListOptions(data, STAFF_PICKS);

      seasonListOptions = modeledOptionObject.options;

      // Updates default season list options with API response
      listOptions.season.options = seasonListOptions;

      // Calls the selected list
      return nyplApiClientGet(`${platformConfig.endpoints.staffPicksPath}${requestedSeason}`);
    })
    .then((data) => {
      const filters = utils.getAllTags(data.picks);
      // Get the subset of tags that the picks can be filtered by.
      const selectableFilters = utils.getSelectableTags(data.picks);

      // If error returned from the endpoint
      if (data.statusCode >= 400) {
        logger.error(`Status Code: ${data.statusCode}, Error Message: ${data.error}`);

        return res.redirect(`${config.baseUrl}/404`);
      }

      // Uodate the option lists' default values by the request params
      listOptions.season.currentValue = requestedSeason;
      listOptions.audience.currentValue = audience;

      res.locals.data = {
        BookStore: {
          filters,
          picksData: data,
          selectableFilters,
          isJsEnabled: false,
          listOptions,
          currentSeason: requestedSeason,
          currentAudience: audience,
        },
        pageTitle: config.pageTitle[STAFF_PICKS],
        metaTags: config.metaTags[STAFF_PICKS],
      };
      next();
    })
    .catch((error) => {
      logger.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      return res.redirect(`${config.baseUrl}/404`);
    });
}

/**
 * selectClientMonthData(req, res, next)
 * Gets a specific month's or season's staff pick list on the client side.
 */
function selectClientMonthData(req, res) {
  const dateRequest = req.params.time;
  // Redirects older three part dates in URLs to the new two part date before validation.
  if (dateRequest && /^(\d{4})-(\d{2})-(\d{2})$/.test(dateRequest)) {
    const newPath = req.url.replace(/(\d{4})-(\d{2})-(\d{2})/, utils.toMonthAndYear);
    return res.redirect(`${config.baseUrl}${newPath}`);
  }

  // Checks if the URL input fits season's convention
  const seasonMatches = matchListDate(dateRequest);
  if (!seasonMatches) {
    logger.error('Status Code: 400, Error Message: Invalid season.');

    res.json({
      statusCode: 400,
      errorMessage: 'Invalid season.',
    });
  }

  nyplApiClientGet(`${platformConfig.endpoints.staffPicksPath}${seasonMatches[0]}`)
    .then((data) => {
      res.json({
        title: data.title,
        date: data.date,
        picksData: data,
      });
    })
    .catch((error) => {
      logger.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}`);

      res.json({
        statusCode: error.statusCode || 500,
        errorMessage: error.code,
      });
    });
}

/**
 * selectDataFormPost(req, res, next)
 * Handles the requests from the form submit button (when no JS).
 * It redirects to the route to execute the function for server side requesting.
 */
function selectDataFormPost(req, res) {
  const season = (req.body.season) ? `${req.body.season}` : '';
  const audience = (req.body.audience) ? req.body.audience : '';
  const audienceQuery = audience ? `?audience=${audience}` : '';
  const type = utils.getDataType(req.body.type, true);

  if (!season && !audience) {
    logger.error(
      `Form data of season and audience is undefined. season: ${season}, audience: ${audience}`
    );

    res.redirect(`${config.baseUrl}/404`);
  } else {
    // Redirects to the appropriate list route to make server side request for
    // the season/audience list
    res.redirect(`${config.baseUrl}/${type}/${season}${audienceQuery}`);
  }
}

export default {
  currentMonthData,
  selectMonthData,
  selectClientMonthData,
  selectDataFormPost,
};
