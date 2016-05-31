'use strict';

const ajv = require('ajv'),
      flaschenpost = require('flaschenpost');

const database = require('../database');

const logger = flaschenpost.getLogger();

const postPrizes = function (req, res) {
  const eventId = req.params.id,
        prizes = req.body;

  const areValidPrizes = ajv().validate({
    type: 'array',
    items: [
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          count: { type: 'integer' }
        },
        required: [ 'name', 'count' ]
      }
    ]
  }, prizes);

  if (!areValidPrizes) {
    return res.send(400);
  }

  database.savePrizesForEvent(eventId, prizes, err => {
    if (err) {
      logger.error(err.message, { err });

      return res.send(500);
    }
    res.send(200);
  });
};

module.exports = postPrizes;
