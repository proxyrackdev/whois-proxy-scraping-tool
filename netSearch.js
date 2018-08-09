'use strict';

const errors = require('./errors');
const assert = require('assert');
const Promise = require('bluebird');
const whois = require('whois');

let getRandomProxy;

function doSearch(domain, {ip, port, user, pass, version}) {
  const options = {
    //    "server":  "",   // this can be a string ("host:port") or an object with host and port as its keys; leaving it empty makes lookup rely on servers.json
    follow:  2,    // number of times to follow redirects
    timeout: 10 * 1000,
    //    "verbose": false, // setting this to true returns an array of responses from all servers
    //    "bind": null,     // bind the socket to a local IP address
    proxy: {ipaddress: ip, port, version}
  };
  if (user && pass) {
    options.proxy.userId = user;
    options.proxy.password = pass;
    options.proxy.authentication = { // did not work without this shit
      username: user,
      password: pass
    };
  }
  let resolve, reject;
  const p = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  whois.lookup(domain, options, (err, data) => {
    if (err) {
      return reject(err);
    }
    return resolve(data);
  });

  return p;
}

function netSearch(domain) {
  let result = null;
  let error = null;
  const arr = new Array(10);
  return Promise.each(arr, val => {
    if (result) {
      return result;
    }
    const proxy = getRandomProxy();
    if (!proxy) {
      error = errors.ProxyNotFound();
      return error;
    }
    const {ip, port, user, pass, protocol: version} = proxy;
    return doSearch(domain, {ip, port, user, pass, version}).then(resp => {
      result = resp;
    }).catch(err => {
      error = err;
    });
  }).then(() => {
    if (result){
      return result;
    }
    assert(error);
    throw error;
  });
}

netSearch.inject = ({getRandomProxy: grp}) => {
  getRandomProxy = grp;
};

module.exports = netSearch;
