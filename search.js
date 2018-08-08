'use strict';

const errors = require('./errors');

let dbSearch, netSearch, dbStore;

function search(domain) {
  return dbSearch(domain).catch(errors.NotFound, errors.DbNotConnected, err => {
    return netSearch(domain).then(resp => {
      return dbStore(domain, resp).catch(err => {
	//console.log(err.toString());
      }).then(() => {
	return resp;
      });
    });
  });
}

search.inject = ({dbSearch: dbs, netSearch: ns, dbStore: dbst}) => {
  dbSearch = dbs;
  netSearch = ns;
  dbStore = dbst;
};

module.exports = search;
