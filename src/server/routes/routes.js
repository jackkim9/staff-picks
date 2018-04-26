import express from 'express';

import monthData from './monthData';
import appConfig from '../../../appConfig';
import selectData from './selectData';

const router = express.Router();

// API route used in Best Books.
router
  .route(`${appConfig.baseApiUrl}`)
  .post(monthData.selectMonthDataFormPost);

// The route for client side API request of Staff Picks
router
  .route(`${appConfig.baseApiUrl}:time/:id?`)
  .get(monthData.selectClientMonthData);

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
