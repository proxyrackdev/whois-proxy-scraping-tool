'use strict';

const config = require('./config');
const assert = require('assert');
const mongoose = require('mongoose');

function mongooseConnect() {
  mongoose.Promise = require('bluebird');
  assert(config.db.url);
  const dbURL = config.db.url;
  let isConnectedBefore = false;
  function connect() {
    mongoose.connect(dbURL, {
      auto_reconnect: true,
      reconnectTries: Number.MAX_VALUE
    });
  }
  connect();
  mongoose.connection.on('error', err => {
    console.log('db error');
    console.log(err.toString());
    mongoose.disconnect();
  });
  mongoose.connection.on('connected', () => {
    isConnectedBefore = true;
  });
  mongoose.connection.on('disconnected', () => {
    console.log('db disconnected');
    if (isConnectedBefore) {
      return;
    }
    setTimeout(() => connect(), 1000);
  });
}

module.exports = mongooseConnect;
