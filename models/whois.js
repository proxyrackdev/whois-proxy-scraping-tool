'use strict';

const errors = require('../errors');
const assert = require('assert');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const whoisSchema = require('../schema/whois');


whoisSchema.methods = {
  
};

whoisSchema.statics = {
  search(domain) {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected');
      return Promise.reject(new errors.DbNotConnected());
    }
    return this.find({domain}).then(resp => {
      if (resp.length === 0) {
	throw new errors.NotFound();
      }
      return resp[0].response;
    });
  },

  store(domain, response) {
    const doc = new WhoisModel({
      domain,
      response
    });
    return doc.save();
  }
};


const WhoisModel = mongoose.model('whois', whoisSchema, 'whois');
module.exports = WhoisModel;
