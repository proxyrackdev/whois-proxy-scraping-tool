'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whoisSchema = new Schema({
  domain: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Number,
    required: true,
    default: () => {
      return Date.now();
    }
  },
  response: {
    type: String,
    required: true
  }
});

whoisSchema.index({domain: 1}, {unique: true});

module.exports = whoisSchema;
