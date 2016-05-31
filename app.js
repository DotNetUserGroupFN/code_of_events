'use strict';

const http = require('http');

const flaschenpost = require('flaschenpost'),
      processenv = require('processenv');

const database = require('./database'),
      getApp = require('./getApp');

const logger = flaschenpost.getLogger();

const connectionString = processenv('MONGO_URL') || 'mongodb://localhost:27017/nug?reconnect=true',
      port = processenv('PORT') || 3000;

database.connect(connectionString, (err, db) => {
  if (err) {
    logger.fatal(err);
    process.exit(1);
  }

  const app = getApp();
  const server = http.createServer(app);

  server.listen(port, () => {
    logger.info('Server listening.', { port });
  });
});
