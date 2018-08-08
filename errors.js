'use strict';

const assert = require('assert');

class WhoisError extends Error {
  constructor(err = '') {
    super();
    this._err = err;
  }

  toJSON() {
    return {
      type: this.constructor.name,
      msg: this._err.toString()
    };
  }
}

class NotFound extends WhoisError {
  constructor(err) {
    super(err);
  }

  toString() {
    return 'Error: not found';
  }
}

class ProxyNotFound extends WhoisError {
  constructor(err) {
    super(err);
  }

  toString() {
    return 'Error: Proxy not found';
  }
}

class DbNotConnected extends WhoisError {
  constructor(err) {
    super(err);
  }

  toString() {
    return 'Error: database not connected';
  }
}

module.exports = {
  WhoisError,
  NotFound,
  ProxyNotFound,
  DbNotConnected
};
