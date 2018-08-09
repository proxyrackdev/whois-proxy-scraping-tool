'use strict';

const config = require('./config');
const Searcher = require('./searcher');
const search = require('./search');
const WhoisModel = require('./models/whois');
const netSearch = require('./netSearch');
const Proxy = require('./proxy');
const lookupService = require('./services/lookup');
const lookupController = require('./controllers/lookup');
const fs = require('fs');
const mkdirp = require('mkdirp');

function createWriteStream(path) {
  const options = {
    flags: 'w',
    autoClose: true
  };
  const dirname = require('path').dirname(path);
  if (!fs.existsSync(dirname)) {
    mkdirp.sync(dirname);
  }
  const stream = fs.createWriteStream(path, options);
  return stream;
}

function inject() {
  Searcher.inject({
    search
  });
  search.inject({
    dbSearch: WhoisModel.search.bind(WhoisModel),
    netSearch,
    dbStore: WhoisModel.store.bind(WhoisModel)
  });
  netSearch.inject({
    getRandomProxy: Proxy.getRandom.bind(Proxy)
  });

  lookupController.inject({
    startSearch: lookupService.startSearch.bind(lookupService),
    getSearch: lookupService.getSearch.bind(lookupService)
  });

  lookupService.inject({
    Searcher,
    createStream: createWriteStream,
    output: {
      dir: config.outputDir,
      url: config.outputUrl
    },
    numThreads: config.numThreads
  });

}

module.exports = inject;
