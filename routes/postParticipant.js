'use strict';

const ajv = require('ajv'),
      flaschenpost = require('flaschenpost');

const database = require('../database');

const logger = flaschenpost.getLogger();

const postParticipant = function (req, res) {
  const eventId = req.params.id,
        participant = req.body;

  const isValidParticipant = ajv().validate({
    type: 'object',
    properties: {
      name: { type: 'string' },
      phoneNumber: { type: 'string' }
    },
    required: [ 'name', 'phoneNumber' ]
  }, participant);

  if (!isValidParticipant) {
    return res.send(400);
  }

  database.saveParticipantForEvent(eventId, participant, err => {
    if (err) {
      logger.error(err.message, { err });

      return res.send(500);
    }
    res.send(200);
  });
};

module.exports = postParticipant;
