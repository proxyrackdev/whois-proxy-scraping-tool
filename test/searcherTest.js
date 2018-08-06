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

    it('should show progress', done => {
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


  });

});
