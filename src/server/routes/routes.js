import express from 'express';

import monthData from './monthData';
import appConfig from '../../../appConfig';
import selectData from './selectData';
import selectClientData from './selectClientData';

const router = express.Router();

// API route used in staff picks.
router
  .route(`${appConfig.baseApiUrl}post`)
  .post(monthData.selectDataFormPost);

// The route for client side API requests for best books and staff picks
router
  .route(`${appConfig.baseApiUrl}:type/:time/:id?`)
  .get(selectClientData.selectClientData);

// Type detection between best books and staff picks.
router
  .route(`${appConfig.baseUrl}:type/:time?/:id?`)
  .get(selectData.selectData);

// The route for main Staff Picks page
// TODO: baseUrl is now /best-books, we need to rethink what we are showing at default
router
  .route(`${appConfig.baseUrl}`)
  .get(monthData.currentMonthData);

export default router;
