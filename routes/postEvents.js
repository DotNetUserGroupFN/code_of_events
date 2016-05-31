'use strict';

const ajv = require('ajv'),
      flaschenpost = require('flaschenpost'),
      uuid = require('uuidv4');

const database = require('../database');

const logger = flaschenpost.getLogger();

const postEvents = function (req, res) {
  const code = uuid().substring(0, 6);

  const event = req.body;

  const isValidEvent = ajv().validate({
    type: 'object',
    properties: {
      date: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          month: { type: 'integer' },
          day: { type: 'integer' }
        },
        required: [ 'year', 'month', 'day' ]
      }
    },
    required: [ 'date' ]
  }, event);

  if (!isValidEvent) {
    return res.send(400);
  }

  event.id = uuid();
  event.code = code;

  database.saveEvent(event, err => {
    if (err) {
      logger.error(err.message, { err });

      return res.send(500);
    }
    res.send(201);
  });
};

module.exports = postEvents;
