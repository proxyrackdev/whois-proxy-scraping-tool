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
}

class ProxyNotFound extends WhoisError {
  constructor(err) {
    super(err);
  }
}

module.exports = {
  WhoisError,
  NotFound,
  ProxyNotFound
};
