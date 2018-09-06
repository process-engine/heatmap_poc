'use strict';

const fs = require('fs');
const path = require('path');
const should = require('should');
const uuid = require('uuid');
const TestFixtureProvider = require('../dist/commonjs/test_fixture_provider').TestFixtureProvider;

describe('Metric API Tests - ', () => {

  let testFixtureProvider;

  const processModelId = 'heatmap_sample';
  const correlationId = uuid.v4();
  const startEventId = 'StartEvent_1mox3jl';

  const expectedLogFilePath = path.join('logs', correlationId, processModelId);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    await testFixtureProvider.importProcessFiles([processModelId]);
    await executeSampleProcess();
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should write Logs to the expected filepath, using the Correlation ID as a folder and the ProcessModelId as filename.', async () => {
    const processModelLogIsAtExpectedLocation = fs.existsSync(expectedLogFilePath);
    should(processModelLogIsAtExpectedLocation).be.true(`The log file was not writen to the expected path '${expectedLogFilePath}'!`);
  });

  it('should properly format the log entries when writing them to the file and place each entry to a new line', () => {
    const logEntries = readLogFileContent(expectedLogFilePath);
    const logsAreProperlyFormatted = Array.isArray(logEntries) && logEntries.length > 1;
    should(logsAreProperlyFormatted).be.true('The log entries are not properly separated by a newline!');
  });

  it('should write entries for each stage of the ProcessModels execution', () => {
    const logEntries = readLogFileContent(expectedLogFilePath);

    const expectedLogEntryForProcessStarted = /heatmap_sample.*?info.*?process.*?started/i;
    const expectedLogEntryForProcessFinished = /heatmap_sample.*?info.*?process.*?finished/i;

    const processStartWasMeasured = logEntries.some((entry) => {
      return entry.match(expectedLogEntryForProcessStarted);
    });
    should(processStartWasMeasured).be.true();

    const processFinishWasMeasured = logEntries.some((entry) => {
      return entry.match(expectedLogEntryForProcessFinished);
    });

    should(processFinishWasMeasured).be.true();
  });

  it('should write entries for each state change of each FlowNodeInstance', () => {
    // TODO
  });

  async function executeSampleProcess() {

    const initialToken = {
      user_task: false,
    };

    await testFixtureProvider.executeProcess(processModelId, startEventId, correlationId, initialToken);
  }

  function readLogFileContent(logFilePath) {

    // Don't parse anything here. Leave that to the tests of the logging service, where it belongs.
    const logFileContent = fs.readFileSync(logFilePath, 'utf-8');

    const logEntries = logFileContent.split('\n');

    return logEntries;
  }
});
