import monthData from './monthData';
import annualData from './annualData';
import logger from '../../../logger';
import appConfig from '../../../appConfig';

/**
 * selectData(req, res, next)
 * Map the url param to specific endpoint requests. Redirect otherwise to the homepage.
 */
function selectData(req, res, next) {
  const {
    type,
    time,
    id,
  } = req.params;

  if (id) {
    if (type && time) {
      return res.redirect(`${appConfig.baseUrl}/${type}/${time}#${id}`);
    }
    // If there's an id in the url but just in case there's no type or time:
    return res.redirect(`${appConfig.base404}`);
  }

  if (type === 'childrens' || type === 'ya') {
    if (time) {
      return annualData.annualListData(req, res, next);
    }
    return annualData.annualCurrentListData(req, res, next);
  }

  if (type === 'staff-picks') {
    if (time) {
      return monthData.selectMonthData(req, res, next);
    }

    return monthData.currentMonthData(req, res, next);
  }

  logger.info(`Type '${type}' not found in selectData`);

  next();
}

export default {
  selectData,
};
