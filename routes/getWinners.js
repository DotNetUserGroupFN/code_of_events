'use strict';

const flaschenpost = require('flaschenpost'),
      twilio = require('twilio');

const database = require('../database');

const logger = flaschenpost.getLogger();

const twilioClient = twilio(
  // TODO: Add your Twilio credentials here ...
);

const getWinners = function (req, res) {
  const eventId = req.params.id;

  database.getWinners(eventId, (err, winners) => {
    if (err) {
      logger.error(err.message, { err });

      return res.send(500);
    }

    res.send(winners);

    winners.forEach(winner => {
      twilioClient.sendMessage({
        to: winner.winner.phoneNumber,
        from: '...', // TODO: Add your twilio sender number here...
        /* eslint-disable max-len */
        body: `${winner.winner.name}, you have won: ${winner.prize.name}! And don't forget: The winner takes it all...`
        /* eslint-enable max-len */
      });
    });
  });
};

module.exports = getWinners;
