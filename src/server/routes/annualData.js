import appConfig from '../../../appConfig';
import utils from '../../app/utils/utils';

import nyplApiClient from '../helper/nyplApiClient';

const { baseUrl } = appConfig;

const nyplApiClientGet = endpoint =>
  nyplApiClient().then(client => client.get(endpoint, { cache: false }));

/* annualCurrentData
 * Get the latest annual staff pick list for either childrens or ya.
 */
function annualCurrentData(type, req, res, next) {
  const pageTitle = appConfig.pageTitle[type];
  const metaTags = appConfig.metaTags[type];
  let dataType = '';

  if (type === 'childrens') {
    dataType = 'kids';
  } else if (type === 'ya') {
    dataType = 'teens';
  }

  nyplApiClientGet(`/book-lists/${dataType}/2017`)
    .then((data) => {
      const filters = utils.getAllTags(data.picks);
      // Get the subset of tags that the picks can be filtered by.
      const selectableFilters = utils.getSelectableTags(data.picks);

      res.locals.data = {
        BookStore: {
          filters,
          currentPicks: data,
          selectableFilters,
          isJsEnabled: false,
        },
        pageTitle,
        metaTags,
      };

      next();
    })
    .catch((error) => {
      console.log(`Error fetching endpoint: ${error}`);

      res.locals.data = {
        BookStore: {
          filters: [],
          currentPicks: {},
          selectableFilters: [],
          isJsEnabled: false,
        },
        pageTitle: '',
        metaTags: [],
      };

      next();
    });
}

export default {
  annualCurrentData,
};
