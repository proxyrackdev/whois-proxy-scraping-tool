'use trict';

const URL = require('url');
const path = require('path');
const assert = require('assert');
const fs = require('fs');
const shortid = require('shortid');


class Lookup {
  constructor() {
    this._searches = new Map();
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

  }

  inject(options) {
    this._Searcher = options.Searcher;
    this._numThreads = options.numThreads;
    this._createStream = options.createStream;
    this._output = {
      dir: options.output.dir,
      url: options.output.url
    };
  }

  _getRegisteredPath(id) {
    return path.join(this._output.dir, id + '_registered.txt');
  }

  _getRegisteredUrl(id) {
    return URL.resolve(this._output.url, id + '_registered.txt');
  }

  _getAvailablePath(id) {
    return path.join(this._output.dir, id + '_available.txt');
  }

  _getAvailableUrl(id) {
    return URL.resolve(this._output.url, id + '_available.txt');
  }

  _getOutputPath(id) {
    return path.join(this._output.dir, id + '.txt');
  }

  _getOutputUrl(id) {
    return URL.resolve(this._output.url, id + '.txt');
  }

  startSearch({domains, outputPath, numThreads, availablePath,
               registeredPath}) {
    numThreads = numThreads || this._numThreads;
    const searcher = new this._Searcher({domains, numThreads});
    const id = this._storeSearch(searcher);
    const path = outputPath || this._getOutputPath(id);
    availablePath = availablePath || this._getAvailablePath(id);
    registeredPath = registeredPath || this._getRegisteredPath(id);
    const outputStream = this._createStream(path);
    const availableStream = this._createStream(availablePath);
    const registeredStream = this._createStream(registeredPath);
    searcher.on('whoisResponse', (resp) => {
      this._onResponse({outputStream, availableStream, registeredStream}, resp);
    });
    const promise = searcher.start().then(() => {
      return this._onFinish(searcher, {outputStream, availableStream, registeredStream});
    });
    return {id, onFinish: promise};
  }

  _onFinish(searcher, {outputStream, availableStream, registeredStream}) {
    let resolve, reject;
    let p = new Promise((res, rej) => {resolve = res; reject = rej;});
    outputStream.end(() => {
      availableStream.end(() => {
        registeredStream.end(() => {
          resolve();
        });
      });
    });
    return p;
  }

  _onResponse({outputStream, availableStream, registeredStream}, resp) {
    const {domain, response, error} = resp;
    outputStream.write(`${domain}: \n`);
    if (error) {
      outputStream.write('Error\n');
    } else {
      outputStream.write(response);
      if (this._isAvailable(response)) {
        availableStream.write(`${domain}\n`);
      } else {
        registeredStream.write(`${domain}\n`);
      }
    }
    outputStream.write(`\n-------------------------------------------------------\n`);
  }

  _isAvailable(txt) {
    if (txt.toString().toLowerCase().indexOf('no match for') !== -1) {
      return true;
    }
    return false;
  }

  _storeSearch(search) {
    const id = shortid.generate();
    assert(!this._searches.has(id));
    this._searches.set(id, search);
    return id;
  }

  getSearch(id) {
    const search = this._searches.get(id);
    if (!search) {
      return null;
    }
    const progress = search.getProgress();
    const resultUrl = this._getOutputUrl(id);
    progress.resultUrl = resultUrl;
    progress.registeredUrl = this._getRegisteredUrl(id);
    progress.availableUrl = this._getAvailableUrl(id);
    return progress;
  }

}

module.exports = new Lookup();
