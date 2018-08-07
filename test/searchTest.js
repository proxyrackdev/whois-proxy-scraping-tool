'use strict';

const errors = require('../errors');
const sinon = require('sinon');
const Promise = require('bluebird');
const expect = require('chai').expect;
const search = require('../search');

describe('search', () => {
  let dbSearch, netSearch, dbStore;
  beforeEach(() => {
    dbSearch = Promise.resolve;
    netSearch = Promise.resolve;
    dbStore = Promise.resolve;
    search.inject({
      dbSearch: () => {
	return dbSearch();
      },
      netSearch: () => {
	return netSearch();
      },
      dbStore: () => {
	return dbStore();
      }
    });
  });

  it('should not call netSearch if dbSearch resolves', (done) => {
    dbSearch = sinon.fake.resolves('response');
    netSearch = sinon.fake();
    search('google.com').then(resp => {
      expect('response').to.equal(resp);
      expect(0).to.equal(netSearch.callCount);
      done();
    });
  });

  it('should call netSearch if dbSearch rejects with NotFound', done => {
    dbSearch = sinon.stub().usingPromise(Promise).rejects(new errors.NotFound());
    netSearch = sinon.fake.resolves('resp');
    search('google.com').then(resp => {
      expect('resp').to.equal(resp);
      expect(1).to.equal(dbSearch.callCount);
      expect(1).to.equal(netSearch.callCount);
      done();
    });
  });

  it('should reject if netSearch rejects', done => {
    dbSearch = sinon.stub().usingPromise(Promise).rejects(new errors.NotFound());
    const err = new errors.NotFound();
    netSearch = sinon.stub().usingPromise(Promise).rejects(err);
    search('google.com').catch(error => {
      expect(err).to.equal(error);
      done();
    });
  });

  it('should call dbStore if dbSearch rejects and netSearch resolves', done => {
    dbSearch = sinon.stub().usingPromise(Promise).rejects(new errors.NotFound());
    netSearch = sinon.stub().usingPromise(Promise).resolves('resp');
    dbStore = sinon.stub().usingPromise(Promise).resolves();
    search('google.com').then(resp => {
      expect(1).to.equal(dbStore.callCount);
      done();
    });
  });

});
