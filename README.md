# ProxyRack WHOIS Tool

[![N|Solid](https://www.proxyrack.com/wp-content/uploads/2018/02/logo-name.svg)](https://www.proxyrack.com)

ProxyRack WHOIS Tool is a multi-threaded, socks5 proxy supported NodeJS application that can be used to scrape WHOIS record data or check domain availability.

This is a free tool provided by https://www.proxyrack.com

**Features**
  - SOCKS proxy support with or without user credentials
  - Multi-threaded
  - NodeJS
  - Web UI and CLI
  - Optional: MongoDB to store results

![alt text](https://www.proxyrack.com/wp-content/uploads/2018/09/proxyrack_whois_tool_sml.png)

### Installation

ProxyRack WHOIS Tool requires node >=8.93
Quick node installation (multiple OS) https://github.com/creationix/nvm

Install the dependencies and devDependencies and start the web UI server.

```sh
$ cd whois-proxy-scraping-tool
$ npm install
$ node index.js --mode server --port 8080 --web-port 8000
```

For CLI:

```sh
$ node index.js --mode file --input domains.txt --output result.txt --output-available available.txt --output-registered registered.txt
```

### proxies.json

Proxies are stored in a JSON file called `proxies.json`
```
{
  "proxies": [
    "yourusername:yourpassword@megaproxy.rotating.proxyrack.net:222 socks5"
  ]
}
```
Example proxy included is from `www.proxyrack.com` service
### config.js
You can modify your MongoDB settings here, proxies file path, results directories and set the number of concurrent threads you want to run
```
'use strict';

const config = {
  db: {
    url: 'mongodb://localhost:27017',
    name: 'whois'
  },
  proxies: {
    path: 'proxies.json'
  },
  numThreads: 50,                        // number of threads per search
  outputDir: './results',
  outputUrl: '/results/'
};


```
### Further documentation and discussion
Here: https://www.proxyrack.com/whois-socks-proxy-scraping-tool

Developed by Nodarius
