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

  _getOutputPath(id) {
    return path.join(this._output.dir, id + '.txt');
  }

  _getOutputUrl(id) {
    return URL.resolve(this._output.url, id + '.txt');
  }

  startSearch({domains, outputPath, numThreads}) {
    numThreads = numThreads || this._numThreads;
    const searcher = new this._Searcher({domains, numThreads});
    const id = this._storeSearch(searcher);
    const path = outputPath || this._getOutputPath(id);
    const stream = this._createStream(path);
    searcher.on('whoisResponse', (resp) => {
      this._onResponse(stream, resp);
    });
    const promise = searcher.start().then(() => {
      return this._onFinish(searcher, stream);
    });
    return {id, onFinish: promise};
  }

  _onFinish(searcher, stream) {
    let resolve, reject;
    let p = new Promise((res, rej) => {resolve = res; reject = rej;});
    stream.end(() => {
      resolve();
    });
    return p;
  }

  _onResponse(stream, resp) {
    const {domain, response, error} = resp;
    stream.write(`${domain}: \n`);
    if (error) {
      stream.write('Error\n');
    } else {
      stream.write(response);
    }
    stream.write(`\n-------------------------------------------------------\n`);
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
    return progress;
  }

}

module.exports = new Lookup();
