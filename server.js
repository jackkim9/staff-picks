import path from 'path';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import React from 'react';
import { match, RouterContext } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import Iso from 'iso';

import webpackConfig from './webpack.config';
import appConfig from './appConfig';
import appRoutes from './src/app/routes/routes';
import expressRoutes from './src/server/routes/routes';
import nyplApiClient from './src/server/helper/nyplApiClient';
import alt from './src/app/alt';

// URL configuration
const ROOT_PATH = __dirname;
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const INDEX_PATH = path.resolve(ROOT_PATH, 'src/client');
const WEBPACK_DEV_PORT = appConfig.webpackDevServerPort || 3000;
const app = express();
const isProduction = process.env.NODE_ENV === 'production';
// Assign versioned build assets only on production environment
const buildAssets = (isProduction) ?
  JSON.parse(fs.readFileSync(path.join(DIST_PATH, 'assets.json'))) : '';

app.use(compress());
app.disable('x-powered-by');

app.set('view engine', 'ejs');

app.set('views', path.resolve(ROOT_PATH, 'src/server/views'));
app.set('port', process.env.PORT || appConfig.port);

app.set('nyplPublicKey', appConfig.publicKey);

// For parsing the form data via POST, we need body-parser
// and the format should be application/x-www-form-urlencoded for HTML from data
app.use(bodyParser.urlencoded({ extended: true }));

// first assign the path
app.use('*/dist', express.static(DIST_PATH));

// Assign the path for static client files
app.use('*/src/client', express.static(INDEX_PATH));

// Init the nypl data api client.
nyplApiClient();

app.use('/', expressRoutes);

// after get the path
app.use('/', (req, res) => {
  alt.bootstrap(JSON.stringify(res.locals.data || {}));
  const iso = new Iso();

  const routes = appRoutes.client;

  /* React Router specific code snippet to render appropriate server component or error.
   *
   */
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const html = ReactDOMServer.renderToString(<RouterContext {...renderProps} />);
      const safePath = req.path.replace(/'/g, '').replace(/"/g, '');
      // Generate meta tags markup
      const metaTags = (res.locals.data && res.locals.data.metaTags) ?
        res.locals.data.metaTags : [];
      const renderedMetaTags = metaTags.map((tag, index) =>
        ReactDOMServer.renderToString(<meta key={index} {...tag} />));
      const renderedPageTitle = (res.locals.data && res.locals.data.pageTitle) ?
        res.locals.data.pageTitle : '';

      iso.add(html, alt.flush());

      res
        .status(200)
        .render('index', {
          path: safePath,
          isProduction,
          metatags: renderedMetaTags,
          markup: iso.render(),
          assets: buildAssets,
          webpackPort: WEBPACK_DEV_PORT,
          pageTitle: renderedPageTitle,
        });
    } else {
      res.status(404).send('Not found');
    }
  });
});

const server = app.listen(app.get('port'), () => {
  console.log(`server running at localhost: ${app.get('port')}, go refresh and see magic`);
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit();
  });
  // if after
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 1000);
};
// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);


/* Development Environment Configuration
 * -------------------------------------
 * - Using Webpack Dev Server
*/
if (!isProduction) {
  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    inline: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Headers': 'X-Requested-With',
    },
  }).listen(appConfig.webpackDevServerPort, 'localhost', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Webpack Dev Server listening at localhost: ${appConfig.webpackDevServerPort}`);
    }
  });
}
