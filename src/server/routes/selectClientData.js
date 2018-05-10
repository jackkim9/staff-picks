import monthData from './monthData';
import annualData from './annualData';
import config from '../../../appConfig';

const { baseUrl } = config;

/**
 * selectClientData(req, res, next)
 * Map the url param to specific endpoint requests. Redirect otherwise to the homepage.
 */
function selectClientData(req, res, next) {
  const type = req.params.type;

  if (type === 'kids' || type === 'teens') {
    return annualData.annualClientListData(req, res, next);
  }

  if (type === 'staff-picks') {
    return monthData.selectClientMonthData(req, res, next);
  }

  return res.redirect(baseUrl);
}

export default {
  selectClientData,
};
