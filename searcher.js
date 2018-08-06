'use strict';

const EventEmitter = require('events');
const Promise = require('bluebird');

class Searcher extends EventEmitter {

  constructor({domains, nThreads = 1}) {
    super();
    this._domains = domains;
    this._nThreads = nThreads;
    this._success = 0;
    this._error = 0;
  }

  getProgress() {
    return {
      total: this._domains.length,
      finished: this._success + this._error,
      success: this._success,
      error: this._error
    };
  }

  start() {
    return Promise.map(this._domains, (domain) => {
      return Searcher._search(domain).then(() => {
	this._success++;
      }).catch(err => {
	this._error++;
      });
    }, {
      concurrency: this._nThreads
    }).then(() => {
      this.emit('finish');
    });
  }

  static inject({search}) {
    this._search = search;
  }
};


module.exports = Searcher;
