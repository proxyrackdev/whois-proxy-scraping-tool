'use strict';

function addExitHandlers() {

  process.on('uncaughtException', err => {
    console.error('Uncaught exception');
    console.error(err);
  });

  process.on('unhandledRejection', err => {
    console.error('Unhandled rejection');
    console.error(err);
  });
}

module.exports = addExitHandlers;
