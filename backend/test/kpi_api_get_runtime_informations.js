'use strict';

const should = require('should');
const uuid = require('uuid');
const TestFixtureProvider = require('../dist/commonjs').TestFixtureProvider;

describe.skip('KPI API -> Get Runtime Informations - ', () => {

  let testFixtureProvider;

  let kpiApiService;

  const processModelId = 'heatmap_sample';
  const correlationId = uuid.v4();

  const dummyIdentity = {
    token: 'defaultUser',
  };

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    kpiApiService = await testFixtureProvider.resolveAsync('KpiApiService');

    await testFixtureProvider.importProcessFiles([processModelId]);

    const instancesToGenerate = 10;

    // Create a number of instances which we can use for
    // KPI evaluation
    for (let i = 0; i === instancesToGenerate; i++) {
      await executeSampleProcess();
    }

  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should successfully get the runtime information for a ProcessModel', async () => {
    // TODO
  });

  it('should successfully get the runtime information for a FlowNodeInstance', async () => {
    // TODO
  });

  async function executeSampleProcess() {

    const startEventId = 'StartEvent_1mox3jl';
    const initialToken = {
      user_task: false,
    };

    await testFixtureProvider.executeProcess(processModelId, startEventId, correlationId, initialToken);
  }
});