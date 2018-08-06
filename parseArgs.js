'use strict';

const ArgumentParser = require('argparse').ArgumentParser;

function parseArgs() {
  const parser = new ArgumentParser({
    addHelp: true
  });
  parser.addArgument(
    ['--mode'],
    {
      help: 'search single file and exit, or start a web server',
      choices: ['file', 'server']
    }
  );
  parser.addArgument(
    '--input',
    {
      help: 'path to domains file'
    }
  );

  const args = parser.parseArgs();
  return args;
}


module.exports = parseArgs;
