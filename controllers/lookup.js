'use strict';

const Promise = require('bluebird');
const assert = require('assert');
const Controller = require('./controller');
const errors = require('../errors');

class Lookup extends Controller {
  constructor() {
    super();
  }

  inject(options) {
    this._startSearch = options.startSearch;
    this._getSearch = options.getSearch;
    
  }

  lookup(req, res) {
    console.log('starting looking up');
    this._parseBody(req, (err, domains) => {
      if (err) {
	this.sendError(err, res);
	return;
      }
      console.log('%d domains to look up', domains.length);
      const {id, onFinish} = this._startSearch({domains});
      this.sendSuccess({
	id
      }, res);
    });
  }

  _parseBody(req, cb) {
    let data = '';
    req.on('data', d => {
      data += d.toString();
    });
    req.on('end', () => {
      const arr = data.split('\n')
	    .map(line => line.trim())
	    .filter(line => line.length > 0);
      cb(null, arr);
    });
    req.on('error', cb);
  }

  getLookup(req, res) {
    console.log('Getting lookup progress');
    const {lookupId} = req.params;
    const lookup = this._getSearch(lookupId);
    if (!lookup) {
      console.log('Lookup by id %s not found', lookupId);
      const err = new errors.NotFound('Lookup not found');
      this.sendError(err, res);
      return;
    }
    this.sendSuccess(lookup, res);
  }

};

module.exports = new Lookup();
