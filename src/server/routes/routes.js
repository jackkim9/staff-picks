import express from 'express';

import monthData from './monthData';
import annualData from './annualData';
import appConfig from '../../../appConfig';

const router = express.Router();

// Not currently used in Best Books.
router
  .route(appConfig.baseMonthUrl)
  .get(monthData.currentMonthData);

// NOTE: The :year and :id params are currently not being used.
router
  .route(`${appConfig.baseAnnualUrl}:type/:year?/:id?`)
  .get(annualData.selectAnnualData);

router
  .route(`${appConfig.baseApiUrl}`)
  .post(monthData.selectMonthDataFormPost);

// The route for client side API request of Staff Picks
router
  .route(`${appConfig.baseApiUrl}:month/:id?`)
  .get(monthData.selectClientMonthData);

// The route for server side API request of Staff Picks
router
  .route(`${appConfig.baseMonthUrl}:month/:id?`)
  .get(monthData.selectMonthData);

// The route for main Staff Picks page
router
  .route(`${appConfig.baseMonthUrl}`)
  .get(monthData.currentMonthData);

export default router;
