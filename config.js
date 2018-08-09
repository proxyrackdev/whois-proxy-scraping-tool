'use strict';

const config = {
  db: {
    url: 'mongodb://localhost:27017',
    name: 'whois'
  },
  proxies: {
    path: 'proxies.json'
  },
  numThreads: 1,                        // number of threads per search
  outputDir: './results',
  outputUrl: '/results/'
};

module.exports = config;
