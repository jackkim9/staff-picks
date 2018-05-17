// React library
import React from 'react';
// Import Router
import { IndexRoute, Router, Route } from 'react-router';

// Import components
import App from '../components/Application/Application';
import Main from '../components/Application/Main';
import Error404Page from '../components/Error404Page/Error404Page';

import config from '../../../appConfig';

// Routes are specified directly here in order to properly match and route to
// the 404 page appropriately.
const routes = {
  client: (
    <Router>
      <Route path={`${config.baseUrl}`} component={App}>
        <IndexRoute component={Main} />
        <Route path={`${config.base404}`} status={404} component={Error404Page} />
        <Route path={`${config.baseUrl}/staff-picks`} component={Main}>
          <Route path={`${config.baseUrl}/staff-picks/:time`} component={Main} />
        </Route>
        <Route path={`${config.baseUrl}/childrens`} component={Main}>
          <Route path={`${config.baseUrl}/childrens/:time`} component={Main} />
        </Route>
        <Route path={`${config.baseUrl}/ya`} component={Main}>
          <Route path={`${config.baseUrl}/ya/:time`} component={Main} />
        </Route>
        <Route path="*" status={404} component={Error404Page} />
      </Route>
    </Router>
  ),
};

export default routes;
