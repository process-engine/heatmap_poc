'use strict';

const LoggingRepository = require('./dist/commonjs/index').LoggingRepository;

function registerInContainer(container) {

  container
    .register('LoggingRepository', LoggingRepository)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
