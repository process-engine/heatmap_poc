'use strict';

const should = require('should');
const uuid = require('uuid');
const TestFixtureProvider = require('../dist/commonjs').TestFixtureProvider;

describe.only('KPI API -> Get Runtime Informations - ', () => {

  let testFixtureProvider;

  let kpiApiService;

  const processModelId = 'kpi_api_test_data';
  const correlationId = uuid.v4();

  const dummyIdentity = {
    token: 'defaultUser',
  };

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    kpiApiService = await testFixtureProvider.resolveAsync('KpiApiService');

    await testFixtureProvider.importProcessFiles([processModelId]);
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
});
