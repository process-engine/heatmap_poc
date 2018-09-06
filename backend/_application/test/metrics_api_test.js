'use strict';

const fs = require('fs');
const path = require('path');
const should = require('should');
const uuid = require('uuid');
const TestFixtureProvider = require('../dist/commonjs/test_fixture_provider').TestFixtureProvider;

describe.only('Metric API Tests - ', () => {

  let testFixtureProvider;

  const processModelId = 'heatmap_sample';
  const startEventId = 'StartEvent_1mox3jl';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    await testFixtureProvider.importProcessFiles([processModelId]);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should write ProcessModel Logs to the configured log file during process execution.', async () => {

    const initialToken = {
      user_task: false,
    };

    const correlationId = uuid.v4();

    await testFixtureProvider.executeProcess(processModelId, startEventId, correlationId, initialToken);

    const expectedLocationOfLogFiles = 'logs';
    const expectedLogFolderName = path.join(expectedLocationOfLogFiles, correlationId);
    const expectedLogFileName = path.join(expectedLogFolderName, processModelId);

    const logFolderIsAtExpectedLocation = fs.existsSync(expectedLocationOfLogFiles);
    const logFolderHasSubfolderForCorrelations = fs.existsSync(expectedLogFolderName);
    const processModelLogExists = fs.existsSync(expectedLogFileName);

    should(logFolderIsAtExpectedLocation).be.true();
    should(logFolderHasSubfolderForCorrelations).be.true();
    should(processModelLogExists).be.true();
  });
});
