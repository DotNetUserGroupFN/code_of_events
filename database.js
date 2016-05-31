'use strict';

const flaschenpost = require('flaschenpost'),
      mongodb = require('mongodb'),
      randy = require('randy');

const MongoClient = mongodb.MongoClient;

const logger = flaschenpost.getLogger();

const database = {};

database.instance = undefined;

database.connect = function (connectionString, callback) {
  logger.debug('Connecting to database...', { connectionString });

  MongoClient.connect(connectionString, (err, db) => {
    if (err) {
      logger.error('Failed to connect to database', { err, connectionString });

      return callback(err);
    }

    database.instance = db;
    logger.info('Connected to database.', { connectionString });
    callback(null);
  });
};

database.getEvents = function (callback) {
  database.instance.collection('events', (errCollection, collection) => {
    if (errCollection) {
      return callback(errCollection);
    }

    collection.find().toArray((err, events) => {
      if (err) {
        return callback(err);
      }
      callback(null, events);
    });
  });
};

database.saveEvent = function (event, callback) {
  database.instance.collection('events', (errCollection, collection) => {
    if (errCollection) {
      return callback(errCollection);
    }

    collection.insertOne(event, err => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
};

database.savePrizesForEvent = function (eventId, prizes, callback) {
  database.instance.collection('events', (errCollection, collection) => {
    if (errCollection) {
      return callback(errCollection);
    }

    collection.updateOne({ id: eventId }, {
      $set: { prizes }
    }, err => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
};

database.saveParticipantForEvent = function (eventId, participant, callback) {
  database.instance.collection('events', (errCollection, collection) => {
    if (errCollection) {
      return callback(errCollection);
    }

    collection.updateOne({ id: eventId }, {
      $push: { participants: participant }
    }, err => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
};

database.getWinners = function (eventId, callback) {
  database.instance.collection('events', (errCollection, collection) => {
    if (errCollection) {
      return callback(errCollection);
    }

    collection.findOne({ id: eventId }, (err, event) => {
      if (err) {
        return callback(err);
      }

      const participants = event.participants,
            prizes = event.prizes;

      const individualPrizes = [];

      for (let i = 0; i < prizes.length; i++) {
        for (let j = 0; j < prizes[i].count; j++) {
          individualPrizes.push({ name: prizes[i].name });
        }
      }

      const winners = randy.sample(participants, individualPrizes.length);
      const shuffledWinners = randy.shuffle(winners);

      const result = [];

      for (let i = 0; i < shuffledWinners.length; i++) {
        result.push({ winner: shuffledWinners[i], prize: individualPrizes[i] });
      }

      callback(null, result);
    });
  });
};

module.exports = database;
