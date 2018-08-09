'use strict';

const express = require('express');
const lookupCtrl = require('../controllers/lookup');

const router = express.Router();

function init() {
  const ctrl = lookupCtrl;
  router.post('/', ctrl.lookup.bind(ctrl));
  router.get('/:lookupId', ctrl.getLookup.bind(ctrl));
}

init();
module.exports = router;
