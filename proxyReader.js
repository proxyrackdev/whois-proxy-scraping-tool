'use strict';

const Proxy = require('./proxy');
const fs = require('fs');
const assert = require('assert');

class ProxyReader {
  constructor(path) {
    this._path = path;
    this._startReading();
  }

  _startReading() {
    fs.watch(this._path, () => {
      console.log('File updated');      
      this._onUpdate();
    });
    this._onUpdate();
  }

  update() {
    this._onUpdate();
  }

  _onUpdate() {
    const content = fs.readFileSync(this._path).toString().trim();
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.log('Could not parse json');
      console.log(e);
      return;
    }
    Proxy.clear();
    const arr = parsed.proxies;
    arr.forEach(line => {
      try {
	new Proxy(line);
      } catch (e) {
	if (e === Proxy.InvalidProxy) {
	  console.log('Invalid proxy:');
	  console.log(line);
	}
	throw e;
      }
    });
  }

}

module.exports = ProxyReader;
