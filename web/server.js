'use strict';

const express = require('express');

class Server {
  constructor() {
    
  }

  start({ip, port, apiPort}) {
    this._app = express();

    const use = this._app.use;
    const self = this._app;

    this._setApiPort(8080);
    this._addRoutes();
    this._startListening({ip, port});
  }

  _setApiPort(port) {
    const fs = require('fs');
    let content = fs.readFileSync('public/.main.js').toString();
    content = content.replace('API_PORT', port);
    fs.writeFileSync('public/main.js', content);
  }

  _startListening({ip, port}) {
    this._app.listen(port, ip, () => {
      console.log('Web server listening on: %s:%s', ip, port);
    });
  }

  _addRoutes() {
    this._app.use('/', express.static('public'));
  }
}

module.exports = new Server();
