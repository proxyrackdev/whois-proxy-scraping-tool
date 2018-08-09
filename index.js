'use strict';

const mongooseConnect = require('./mongooseConnect');
const inject = require('./inject');
const config = require('./config');
const parseArgs = require('./parseArgs');
const addExitHandlers = require('./addExitHandlers');
const fs = require('fs');
const ProxyReader = require('./proxyReader');
const Searcher = require('./searcher');
const server = require('./server');
const lookupService = require('./services/lookup');

function getDomains(domainsPath) {
  const content = fs.readFileSync(domainsPath).toString().trim();
  const domains = content.split('\n').map(line => line.trim())
        .filter(line => line.length > 0);
  return domains;
}

function startServerMode({ip, port}) {
  server.start({ip, port});
}

function startFileMode(domainsPath, outputPath, numThreads) {
  const domains = getDomains(domainsPath);
  const {id, onFinish} = lookupService.startSearch({domains, outputPath});
  setInterval(() => {
    const {total, finished, success, error, elapsedTime, remainingTime} =
	  lookupService.getSearch(id);
    console.log({total, finished, success, error, elapsedTime, remainingTime});
  }, 1000);
  onFinish.then(() => {
    console.log('Finished writing to file');
    process.exit(0);
  });
}

function startFileMode1(domainsPath, outputPath, numThreads) {
  const options = {
    flags: 'w',
    autoClose: true
  };
  const stream = fs.createWriteStream(outputPath, options);

  const domains = getDomains(domainsPath);
  const searcher = new Searcher({domains, numThreads});
  searcher.on('whoisResponse', resp => {
    const {domain, response, error} = resp;
    stream.write(`${domain}: \n`);
    if (error) {
      stream.write('Error\n');
    } else {
      stream.write(response);
    }
    stream.write(`\n-------------------------------------------------------\n`);
  });
  searcher.start().then(() => {
    console.log('Done');
    console.log(searcher.getProgress());
    stream.end(() => {
      process.exit(0);
    });
  });

  setInterval(() => {
    const progress = searcher.getProgress();
    console.log(progress);
  }, 1000);


}

function readProxies() {
  const reader = new ProxyReader(config.proxies.path);
  reader.update();
}

function main() {
  inject();
  mongooseConnect();
  const args = parseArgs();
  addExitHandlers();
  readProxies();
  if (args.mode === 'file') {
    const path = args.input;
    const outputPath = args.output;
    const numThreads = args.numThreads || config.numThreads;
    config.numThreads = numThreads;
    startFileMode(path, outputPath, numThreads);
    return;
  }

  if (args.mode === 'server') {
    const port = args.port;
    const ip = args.ip;
    startServerMode({ip, port});
  };

}

if (require.main === module) {
  main();
}
