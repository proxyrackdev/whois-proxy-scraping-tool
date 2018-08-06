'use strict';

const parseArgs = require('./parseArgs');

function main() {
  const args = parseArgs();
  console.log(args);
}

if (require.main === module) {
  main();
}
