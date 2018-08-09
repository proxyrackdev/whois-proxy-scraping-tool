'use strict';

const express = require('express');
const lookupRoutes = require('./routes/lookup');
const config = require('./config');

class Server {
  constructor() {
    
  }

  start({ip, port}) {
    this._app = express();

    const use = this._app.use;
    const self = this._app;

    this._addRoutes();
    this._startListening({ip, port});
  }

  _startListening({ip, port}) {
    this._app.listen(port, ip, () => {
      console.log('Server listening on: %s:%s', ip, port);
    });
  }

  _addRoutes() {
    this._app.use(config.outputUrl, express.static(config.outputDir));
    this._app.use('/lookups', lookupRoutes);
  }

};

module.exports = new Server();
