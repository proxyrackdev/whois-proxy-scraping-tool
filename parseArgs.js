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
      help: 'Path to domains file'
    }
  );

  parser.addArgument(
    '--output',
    {
      help: 'Path to output file'
    }
  );

  parser.addArgument(
    '--output-available',
    {
      help: 'List of available domains'
    }
  ),

  parser.addArgument(
    '--output-registered',
    {
      help: 'List of registered domains'
    }
  ),

  parser.addArgument(
    '--port',
    {
      help: 'API port, when in server mode'
    }
  );

  parser.addArgument(
    '--web-port',
    {
      help: 'Web port, when in server mode'
    }
  ),

  parser.addArgument(
    '--ip',
    {
      help: 'Which IP to bind when in server mode',
      defaultValue: '0.0.0.0'
    }
  );

  parser.addArgument(
    '--num-threads',
    {
      help: 'Number of threads per search'
    }
  );

  const args = parser.parseArgs();
  return args;
}


module.exports = parseArgs;
