'use strict';

const assert = require('assert');
const EventEmitter = require('events');
const Promise = require('bluebird');

class Searcher extends EventEmitter {

  constructor({domains, numThreads = 1}) {
    super();
    assert(numThreads);
    this._domains = domains;
    this._nThreads = numThreads;
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
      elapsedTime: this._elapsedTime(),
      remainingTime: this._calculateRemaining()
    };
    return progress;
  }

  _elapsedTime() {
    let result;
    if (this._endTime) {
      result = this._endTime - this._startTime;
    } else {
      result = Date.now() - this._startTime;
    }
    return parseInt(result / 1000);
  }

  _calculateRemaining() {
    const finished = this._success + this._error;
    const remaining = this._domains.length - finished;
    if (finished === 0) {
      return 0;
    }
    const elapsedTime = this._elapsedTime();
    const result = remaining * elapsedTime / finished;
    return parseInt(result);
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
      this._endTime = Date.now();
      this.emit('finish');
    });
  }

  static inject({search, numThreads}) {
    this._search = search;
  }
};


module.exports = Searcher;
