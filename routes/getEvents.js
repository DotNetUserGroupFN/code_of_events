'use strict';

const flaschenpost = require('flaschenpost');

const database = require('../database');

const logger = flaschenpost.getLogger();

const getEvents = function (req, res) {
  database.getEvents((err, events) => {
    if (err) {
      logger.error(err.message, { err });

      return res.send(500);
    }

    res.send(events);
  });
};

module.exports = getEvents;
