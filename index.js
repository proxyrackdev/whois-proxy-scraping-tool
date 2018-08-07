'use strict';

const parseArgs = require('./parseArgs');
const addExitHandlers = require('./addExitHandlers');

function main() {
  const args = parseArgs();
  console.log(args);
  addExitHandlers();
}

if (require.main === module) {
  main();
}
