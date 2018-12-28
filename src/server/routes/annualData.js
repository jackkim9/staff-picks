import nyplApiClient from '../helper/nyplApiClient';
import config from '../../../appConfig';
import logger from '../../../logger';

import utils from '../../app/utils/utils';
import platformConfig from '../../../platformConfig';
import modelListOptions from '../../app/utils/ModelListOptionsService';
import { matchListDate } from '../../app/utils/DateService';

const nyplApiClientGet = endpoint =>
  nyplApiClient().then(client => client.get(endpoint, { cache: false, authenticate: false }));

/**
 * annualCurrentListData(req, res, next)
 * Get the latest year's list for either childrens or ya.
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
function annualCurrentListData(req, res, next) {
  const listOptions = config.annualListOptions;
  const { type } = req.params;
  let annualListOptions = [];
  let latestYear = '';
  const dataType = utils.getDataType(type);

  nyplApiClientGet(platformConfig.endpoints.annualLists[dataType])
    .then((data) => {
      // Models the options based on the data returned
      const modeledOptionObject = modelListOptions(data, type);

      annualListOptions = modeledOptionObject.options;
      latestYear = modeledOptionObject.latestOption;

      // Updates default year's list options with API response
      listOptions.season.options = annualListOptions;

      // Calls the latest list
      return nyplApiClientGet(`${platformConfig.endpoints.annualPath}${dataType}/${latestYear}`);
    })
    .then((data) => {
      const filters = utils.getAllTags(data.picks);
      // Get the subset of tags that the picks can be filtered by.
      const selectableFilters = utils.getSelectableTags(data.picks);

      // If error returned from the endpoint
      if (data.statusCode >= 400) {
        logger.error(`Status Code: ${data.statusCode}, Error Message: ${data.error}, Endpoint: ${platformConfig.endpoints.annualPath}${dataType}/${latestYear}, Redirecting to: ${config.baseUrl}/404`);

        return res.redirect(`${config.baseUrl}/404`);
      }

      // Uodate the option lists' default values by the request params
      listOptions.season.currentValue = latestYear;

      res.locals.data = {
        BookStore: {
          filters,
          picksData: data,
          selectableFilters,
          isJsEnabled: false,
          listOptions,
          currentSeason: latestYear,
        },
        pageTitle: config.pageTitle[type],
        metaTags: config.metaTags[type],
      };

      next();
    })
    .catch((error) => {
      logger.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}, Source: annualData.annualCurrentListData, Redirecting to: ${config.baseUrl}/404`, error);

      return res.redirect(`${config.baseUrl}/404`);
    });
}

/**
 * annualListData(req, res, next)
 * Get a specific year's list.
 * It calls '/book-lists?type={type}' to get all the available list options first.
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
function annualListData(req, res, next) {
  const listOptions = config.annualListOptions;
  const { type } = req.params;
  let annualListOptions = [];
  const dataType = utils.getDataType(type);

  // Checks if the URL input fits year's convention
  const yearMatches = matchListDate(req.params.time, type);
  let requestedYear = '';

  if (!yearMatches) {
    logger.error(`Status Code: 400, Error Message: Invalid year ${req.params.time}, Redirect to: ${config.baseUrl}/404`);

    return res.redirect(`${config.baseUrl}/404`);
  }

  // If the param fits year's convention, constructs the request param
  requestedYear = yearMatches[0];

  // The first request to get all the available list options
  nyplApiClientGet(platformConfig.endpoints.annualLists[`${dataType}`])
    .then((data) => {
      // Models the options based on the data returned
      const modeledOptionObject = modelListOptions(data, type);

      annualListOptions = modeledOptionObject.options;

      // Updates default year's list options with API response
      listOptions.season.options = annualListOptions;

      // Calls the selected list
      return nyplApiClientGet(`${platformConfig.endpoints.annualPath}${dataType}/${requestedYear}`);
    })
    .then((data) => {
      const filters = utils.getAllTags(data.picks);
      // Get the subset of tags that the picks can be filtered by.
      const selectableFilters = utils.getSelectableTags(data.picks);

      // If error returned from the endpoint
      if (data.statusCode >= 400) {
        logger.error(`Status Code: ${data.statusCode}, Error Message: ${data.error}, Endpoint: ${platformConfig.endpoints.annualPath}${dataType}/${requestedYear}, Redirecting to: ${config.baseUrl}/404`);
        return res.redirect(`${config.baseUrl}/404`);
      }

      // Uodate the option lists' default values by the request params
      listOptions.season.currentValue = requestedYear;

      res.locals.data = {
        BookStore: {
          filters,
          picksData: data,
          selectableFilters,
          isJsEnabled: false,
          listOptions,
          currentSeason: requestedYear,
        },
        pageTitle: config.pageTitle[type],
        metaTags: config.metaTags[type],
      };
      next();
    })
    .catch((error) => {
      logger.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}, Source: annualData.annualListData, Redirecting to: ${config.baseUrl}/404`, error);

      return res.redirect(`${config.baseUrl}/404`);
    });
}

/**
 * annualClientListData(req, res, next)
 * Gets a specific year's list on the client side.
 * @param {object} req
 * @param {object} res
 */
function annualClientListData(req, res) {
  const dataType = utils.getDataType(req.params.type);
  const yearMatches = matchListDate(req.params.time, req.params.type);

  if (!yearMatches) {
    logger.error(`Status Code: 400, Error Message: Invalid year ${req.params.time} for type ${dataType}`);

    res.json({
      statusCode: 400,
      errorMessage: `Invalid year ${req.params.time} for type ${dataType}`,
    });
  }

  nyplApiClientGet(`${platformConfig.endpoints.annualPath}${dataType}/${yearMatches[0]}`)
    .then((data) => {
      res.json({
        title: data.title,
        date: data.date,
        picksData: data,
      });
    })
    .catch((error) => {
      logger.error(`Status Code: ${error.statusCode}, Error Message: ${error.code}, Endpoint: ${platformConfig.endpoints.annualPath}${dataType}/${yearMatches[0]}`, error);

      res.json({
        statusCode: error.statusCode || 500,
        errorMessage: error.code,
      });
    });
}

export default {
  annualCurrentListData,
  annualListData,
  annualClientListData,
};
