'use strict';

const assert = require('assert');
const EventEmitter = require('events');
const Promise = require('bluebird');

class Searcher extends EventEmitter {

  constructor({domains, nThreads = 1}) {
    super();
    this._domains = domains;
    this._nThreads = nThreads;
    this._success = 0;
    this._error = 0;
    this._startTime = Date.now();
  }

  getProgress() {
    const progress = {
      total: this._domains.length,
      finished: this._success + this._error,
      success: this._success,
      error: this._error,
      elapsedTime: Date.now() - this._startTime,
      remainingTime: this._calculateRemaining()
    };
    return progress;
  }

  _elapsedTime() {
    return Date.now() - this._startTime;
  }

  _calculateRemaining() {
    const finished = this._success + this._error;
    const remaining = this._domains.length - finished;
    const elapsedTime = this._elapsedTime();
    const result = remaining * elapsedTime / finished;
    return result;
  }


  start() {
    this._startTime = Date.now();
    return Promise.map(this._domains, (domain) => {
      return Searcher._search(domain).then(resp => {
        this.emit('whoisResponse', {
          domain,
          response: resp
        });
        this._success++;
      }).catch(err => {
        console.log(err);
        this.emit('whoisResponse', {
          domain,
          error: err
        });
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
