'use strict';

const sinon = require('sinon');
const Promise = require('bluebird');
const expect = require('chai').expect;
const Searcher = require('../searcher');

describe('Searcher', () => {
  let search;
  beforeEach(() => {
    search = Promise.resolve().delay(100000);
    Searcher.inject({
      search: (domain) => {
	return search(domain);
      }
    });
  });

  describe('start', () => {
    it('should emit done if domains array is empty', (done) => {
      const searcher = new Searcher({
	domains: []
      });
      searcher.on('finish', () => {
	done();
      });
      searcher.start();
    });

    it('should count progress', done => {
      const searcher = new Searcher({
	domains: ['domain1']
      });
      const progress = searcher.getProgress();
      expect(1).to.equal(progress.total);
      expect(0).to.equal(progress.finished);
      expect(0).to.equal(progress.success);
      expect(0).to.equal(progress.error);
      done();
    });

    it('should count success', done => {
      search = sinon.stub();
      search.onCall(0).resolves(true);
      search.onCall(1).callsFake(() => {
	const progress = searcher.getProgress();
	expect(1).to.equal(progress.success);
	expect(1).to.equal(progress.finished);
	done();
	return Promise.resolve();
      });
      const searcher = new Searcher({
	domains: ['domain1', 'domain2']
      });
      searcher.start();
    });

    it('should emit whoisResponse on success', done => {
      search = sinon.stub();
      search.onCall(0).resolves('response');
      const searcher = new Searcher({
	domains: ['domain']
      });
      searcher.on('whoisResponse', response => {
	expect('response').to.equal(response.response);
	expect('domain').to.equal(response.domain);
	expect(undefined).to.equal(response.error);
	done();
      });
      searcher.start();
    });

    it('should emit whoisResponse on error with error field', done => {
      const err = new Error('err');
      search = sinon.stub().rejects(err);
      const searcher = new Searcher({domains: ['domain']});
      searcher.on('whoisResponse', response => {
	expect(undefined).to.equal(response.response);
	expect('domain').to.equal(response.domain);
	expect(err).to.equal(response.error);
	done();
      });
      searcher.start();
    });

  });

  describe('countTime', () => {
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should count elapsedTime', done => {
      search = sinon.stub().usingPromise(Promise).resolves();
      const searcher = new Searcher({domains: new Array(10)});
      search.onCall(3).callsFake(() => {
	clock.tick(10 * 1000);
	const progress = searcher.getProgress();
	expect(10).to.equal(progress.elapsedTime);
	done();
      });
      searcher.start();
    });

    it('should calculate remainingTime', done => {
      search = sinon.stub().usingPromise(Promise).resolves();
      const searcher = new Searcher({domains: new Array(10)});
      search.onCall(4).callsFake(() => {
	clock.tick(10 * 1000);
	const progress = searcher.getProgress();
	console.log(progress);
	expect(15).to.equal(progress.remainingTime);
	done();
      });
      searcher.start();
    });
    

  });

});
