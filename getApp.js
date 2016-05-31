'use strict';

const path = require('path');

const bodyParser = require('body-parser'),
      express = require('express');

const routes = require('./routes');

const getApp = function () {
  const app = express();

  app.use(bodyParser.json());
  app.use('/', express.static(path.join(__dirname, 'client')));

  app.get('/api/v1/events', routes.getEvents);
  app.post('/api/v1/events', routes.postEvents);
  app.post('/api/v1/events/:id/prizes', routes.postPrizes);
  app.post('/api/v1/events/:id/participant', routes.postParticipant);
  app.get('/api/v1/events/:id/winners', routes.getWinners);

  return app;
};

module.exports = getApp;
