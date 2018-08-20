'use strict';

const MetricsApiService = require('./dist/commonjs/index').MetricsApiService;

function registerInContainer(container) {

  container
    .register('MetricsApiService', MetricsApiService)
    .dependencies('LoggingRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
