'use strict';

const config = {
  db: {
    url: 'mongodb://localhost:27017',
    name: 'whois'
  },
  proxies: {
    path: 'proxies.json'
  }
};

module.exports = config;
