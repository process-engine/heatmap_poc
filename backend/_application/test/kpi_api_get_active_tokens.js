'use strict';

const should = require('should');
const uuid = require('uuid');
const TestFixtureProvider = require('../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../dist/commonjs').ProcessInstanceHandler;

describe.only('KPI API -> Get Active Tokens - ', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let kpiApiService;

  const processModelId = 'heatmap_sample';
  const correlationId = uuid.v4();
  const userTaskId = 'UserTask_1';

  const dummyIdentity = {
    token: 'defaultUser',
  };

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();

    kpiApiService = await testFixtureProvider.resolveAsync('KpiApiService');

    await testFixtureProvider.importProcessFiles([processModelId]);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);

    await executeProcessAndWaitForUserTask();
  });

  after(async () => {
    await finishUserTask();
    await testFixtureProvider.tearDown();
  });

  it('should successfully get the active tokens for a running ProcessModel', async () => {

    const activeTokens = await kpiApiService.getActiveTokensForProcessModel(dummyIdentity, processModelId);

    should(activeTokens).be.an.Array();
    should(activeTokens.length).be.equal(1);

    const activeToken = activeTokens[0];

    assertActiveToken(activeToken);
  });

  it('should successfully get the active tokens for a running FlowNodeInstance', async () => {

    const activeTokens = await kpiApiService.getActiveTokensForFlowNode(dummyIdentity, userTaskId);

    should(activeTokens).be.an.Array();
    should(activeTokens.length).be.equal(1);

    const activeToken = activeTokens[0];

    assertActiveToken(activeToken);
  });

  it('should not include tokens from already finished ProcessModels with the same ID', async () => {

    // Execute another ProcessInstance and wait for it to finish this time.
    // The tokens of this ProcessInstance should not show as ActiveTokens.
    await executeSampleProcess();

    const activeTokens = await kpiApiService.getActiveTokensForProcessModel(dummyIdentity, processModelId);

    should(activeTokens).be.an.Array();
    should(activeTokens.length).be.equal(1);

    const activeToken = activeTokens[0];

    assertActiveToken(activeToken);
  });

  it('should not include tokens from already finished FlowNodeInstances with the same ID', async () => {

    // Execute another ProcessInstance and wait for it to finish this time.
    // The tokens of this ProcessInstance should not show as ActiveTokens.
    await executeSampleProcess();

    const activeTokens = await kpiApiService.getActiveTokensForFlowNode(dummyIdentity, userTaskId);

    should(activeTokens).be.an.Array();
    should(activeTokens.length).be.equal(1);

    const activeToken = activeTokens[0];

    assertActiveToken(activeToken);
  });

  async function executeSampleProcess() {

    const startEventId = 'StartEvent_1mox3jl';
    const initialToken = {
      user_task: false,
    };

    await testFixtureProvider.executeProcess(processModelId, startEventId, correlationId, initialToken);
  }

  async function executeProcessAndWaitForUserTask() {

    const initialToken = {
      user_task: true,
    };

    await processInstanceHandler.startProcessInstance(processModelId, correlationId, initialToken);
    await processInstanceHandler.waitForCorrelationToReachUserTask(correlationId);
  }

  async function finishUserTask() {

    const userTaskResult = {};

    await testFixtureProvider
      .consumerApiService
      .finishUserTask(testFixtureProvider.consumerContext, processModelId, correlationId, userTaskId, userTaskResult);
  }

  function assertActiveToken(activeToken) {

    const expectedPayload = {
      user_task: true,
    };

    should(activeToken.correlationId).be.equal(correlationId);
    should(activeToken.processModelId).be.equal(processModelId);
    should(activeToken.flowNodeId).be.equal(userTaskId);
    should(activeToken.identity).be.eql(dummyIdentity);
    should(activeToken.payload).be.eql(expectedPayload);

    should(activeToken).have.property('processInstanceId');
    should(activeToken).have.property('flowNodeInstanceId');
    should(activeToken).have.property('createdAt');
  }
});
