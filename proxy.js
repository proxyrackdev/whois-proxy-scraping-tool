'use strict';

const randomItem = require('random-item');
const assert = require('assert');

class InvalidProxy extends Error {
  constructor() {
    super();
  }
};

const proxies = new Set();
let proxiesArr = [];

class Proxy {
  constructor(proxyData) {
    this.setProxyData(proxyData);
    proxiesArr.push(this);
  }

  setProxyData(data) {
    data = data.trim();
    const arr = data.split('@');
    let userPass, addrProtocol;
    if (arr.length !== 1 && arr.length !== 2) {
      throw new InvalidProxy();
    }
    if (arr.length === 1) {
      addrProtocol = arr[0];
    }
    if (arr.length === 2) {
      [userPass, addrProtocol] = arr;
    }

    if (userPass) {
      const [user, pass] = userPass.split(':');
      this._user = user;
      this._pass = pass;
    }

    const [addr, protocol] = addrProtocol.split(' ');
    const [ip, port] = addr.split(':');
    this._ip = ip;
    this._port = port;
    this._protocol = protocol;
    if (protocol !== 'socks4' && protocol !== 'socks5') {
      throw new InvalidProxy();
    }
  }

  get ip() {
    return this._ip;
  }

  get port() {
    return this._port;
  }

  get user() {
    return this._user;
  }

  get pass() {
    return this._pass;
  }

  get protocol() {
    if (this._protocol === 'socks4') {
      return 4;
    }
    if (this._protocol === 'socks5') {
      return 5;
    }
    assert(false);
    return 0;
  }

  static getRandom() {
    return randomItem(proxiesArr);
  }
  
  static clear() {
    proxies.clear();
    proxiesArr = [];
  }

}

Proxy.InvalidProxy = InvalidProxy;
module.exports = Proxy;
