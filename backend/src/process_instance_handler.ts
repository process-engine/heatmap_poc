'use strict';

import * as uuid from 'uuid';

import {
  ProcessStartRequestPayload,
  ProcessStartResponsePayload,
  StartCallbackType,
} from '@process-engine/consumer_api_contracts';
import {IFlowNodeInstanceService} from '@process-engine/process_engine_contracts';

import {TestFixtureProvider} from './test_fixture_provider';

/**
 * This class handles the creation of ProcessInstances and allows to
 * await the occurence of UserTasks.
 */
export class ProcessInstanceHandler {

  private _testFixtureProvider: TestFixtureProvider;

  constructor(testFixtureProvider: TestFixtureProvider) {
    this._testFixtureProvider = testFixtureProvider;
  }

  private get testFixtureProvider(): TestFixtureProvider {
    return this._testFixtureProvider;
  }

  public async startProcessInstance(processModelId: string, correlationId: string, initalValues: any): Promise<string> {

    const startEventId: string = 'StartEvent_1mox3jl';
    const startCallbackType: StartCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;
    const payload: ProcessStartRequestPayload = {
      correlationId: correlationId || uuid.v4(),
      inputValues: initalValues || {},
    };

    const result: ProcessStartResponsePayload = await this.testFixtureProvider
      .consumerApiService
      .startProcessInstance(this.testFixtureProvider.consumerContext, processModelId, startEventId, payload, startCallbackType);

    return result.correlationId;
  }

  public async waitForCorrelationToReachUserTask(correlationId: string): Promise<void> {

    const maxNumberOfRetries: number = 20;
    const delayBetweenRetriesInMs: number = 500;

    const flowNodeInstanceService: IFlowNodeInstanceService =
      await this.testFixtureProvider.resolveAsync<IFlowNodeInstanceService>('FlowNodeInstanceService');

    for (let i: number = 0; i < maxNumberOfRetries; i++) {

      await this.wait(delayBetweenRetriesInMs);

      const flowNodeInstances: Array<any> =
        await flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

      const suspendedFlowNodeReached: boolean = flowNodeInstances && flowNodeInstances.length >= 1;
      if (suspendedFlowNodeReached) {
        return;
      }
    }

    throw new Error(`No process instance within correlation '${correlationId}' found! The process instance likely failed to start!`);
  }

  public async wait(delayTimeInMs: number): Promise<void> {
    await new Promise((resolve: Function): void => {
      setTimeout(() => {
        resolve();
      }, delayTimeInMs);
    });
  }
}
