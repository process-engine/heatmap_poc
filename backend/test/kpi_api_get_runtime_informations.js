'use strict';

const should = require('should');
const TestFixtureProvider = require('../dist/commonjs').TestFixtureProvider;

describe.only('KPI API -> Get Runtime Informations - ', () => {

  let testFixtureProvider;

  let kpiApiService;

  const processModelId = 'kpi_api_test_data';

  const dummyIdentity = {
    token: 'defaultUser',
  };

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    kpiApiService = await testFixtureProvider.resolveAsync('KpiApiService');
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should successfully get the runtime informations for a ProcessModel', async () => {
    const runtimeInfos = await kpiApiService.getRuntimeInformationForProcessModel(dummyIdentity, processModelId);

    should(runtimeInfos).be.an.Array();
    should(runtimeInfos.length).be.equal(6, `Expected 6 runtime informations, but got ${runtimeInfos.length}.`);

    const expectedFlowNodeIds = [
      'StartEvent_1mox3jl',
      'ExclusiveGateway_0fi1ct7',
      'ScriptTask_1',
      'ServiceTask_1',
      'ExclusiveGateway_134ybqm',
      'EndEvent_0eie6q6',
    ];

    for (const flowNodeId of expectedFlowNodeIds) {

      const matchingRuntimeInfo = runtimeInfos.find((runtimeInfo) => {
        return runtimeInfo.flowNodeId === flowNodeId;
      });

      should.exist(matchingRuntimeInfo);
      should(matchingRuntimeInfo.processModelId).be.equal('kpi_api_test_data');
      should(matchingRuntimeInfo).have.property('minRuntimeInMs');
      should(matchingRuntimeInfo).have.property('maxRuntimeInMs');
      should(matchingRuntimeInfo).have.property('arithmeticMeanRuntimeInMs');
      should(matchingRuntimeInfo).have.property('firstQuartileRuntimeInMs');
      should(matchingRuntimeInfo).have.property('medianRuntimeInMs');
      should(matchingRuntimeInfo).have.property('thirdQuartileRuntimeInMs');
    }
  });

  it('should successfully get the runtime information for a FlowNode', async () => {
    const flowNodeToQuery = 'ServiceTask_1';
    const runtimeInfo = await kpiApiService.getRuntimeInformationForFlowNode(dummyIdentity, processModelId, flowNodeToQuery);

    should(runtimeInfo).not.be.an.Array();
    should(runtimeInfo.constructor.name).be.equal('FlowNodeRuntimeInformation');

    const expectedFlowNodeId = 'ServiceTask_1';
    const expectedProcessModelId = 'kpi_api_test_data';
    const expectedMinRuntimeInMs = 10;
    const expectedMaxRuntimeInMs = 15;
    const expectedArithmeticMeanRuntimeInMs = 13;
    const expectedFirstQuartileRuntimeInMs = 0;
    const expectedMedianRuntimeInMs = 0;
    const expectedThirdQuartileRuntimeInMs = 0;

    should(runtimeInfo.flowNodeId).be.equal(expectedFlowNodeId);
    should(runtimeInfo.processModelId).be.equal(expectedProcessModelId);
    should(runtimeInfo.minRuntimeInMs).be.equal(expectedMinRuntimeInMs);
    should(runtimeInfo.maxRuntimeInMs).be.equal(expectedMaxRuntimeInMs);
    should(runtimeInfo.arithmeticMeanRuntimeInMs).be.equal(expectedArithmeticMeanRuntimeInMs);
    should(runtimeInfo.firstQuartileRuntimeInMs).be.equal(expectedFirstQuartileRuntimeInMs);
    should(runtimeInfo.medianRuntimeInMs).be.equal(expectedMedianRuntimeInMs);
    should(runtimeInfo.thirdQuartileRuntimeInMs).be.equal(expectedThirdQuartileRuntimeInMs);
  });
});
