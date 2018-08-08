'use strict';

const mongooseConnect = require('./mongooseConnect');
const inject = require('./inject');
const config = require('./config');
const parseArgs = require('./parseArgs');
const addExitHandlers = require('./addExitHandlers');
const fs = require('fs');
const ProxyReader = require('./proxyReader');
const Searcher = require('./searcher');

function getDomains(domainsPath) {
  const content = fs.readFileSync(domainsPath).toString().trim();
  const domains = content.split('\n').map(line => line.trim())
	.filter(line => line.length > 0);
  return domains;
}


function startFileMode(domainsPath, outputPath) {
  const options = {
    flags: 'w',
    autoClose: true
  };
  const stream = fs.createWriteStream(outputPath, options);

  const domains = getDomains(domainsPath);
  const searcher = new Searcher({domains});
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
    startFileMode(path, outputPath);
    return;
  }

}

if (require.main === module) {
  main();
}
