'use strict';

const IamServiceMock = require('./dist/commonjs/index').IamServiceMock;

const registerInContainer = (container) => {
  // This removes the necessity for having a running IdentityServer during testing.
  container.register('IamService', IamServiceMock);
};

module.exports.registerInContainer = registerInContainer;
