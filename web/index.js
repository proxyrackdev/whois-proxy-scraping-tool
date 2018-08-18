'use strict';

const config = require('./config');
const server = require('./server');

function main() {
  const apiPort = process.argv[2] || config.apiPort;
  server.start({ip: '0.0.0.0', port: config.port, apiPort});
}


if (require.main === module) {
  main();
}
