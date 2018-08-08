'use strict';

const Searcher = require('./searcher');
const search = require('./search');
const WhoisModel = require('./models/whois');
const netSearch = require('./netSearch');
const Proxy = require('./proxy');

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
}

module.exports = inject;
