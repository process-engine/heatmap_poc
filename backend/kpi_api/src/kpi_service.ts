import {ActiveToken, FlowNodeRuntimeInformation, IKpiApiService} from '@process-engine/kpi_api_contracts';
import {IFlowNodeInstanceRepository, Runtime} from '@process-engine/process_engine_contracts';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

type GroupedFlowNodeInstances = {
  [flowNodeId: string]: Array<Runtime.Types.FlowNodeInstance>,
};

export class KpiApiService implements IKpiApiService {

  private _iamService: IIAMService;
  private _flowNodeInstanceRepository: IFlowNodeInstanceRepository;

  constructor(flowNodeInstanceRepository: IFlowNodeInstanceRepository, iamService: IIAMService) {
    this._flowNodeInstanceRepository = flowNodeInstanceRepository;
    this._iamService = iamService;
  }

  private get flowNodeInstanceRepository(): IFlowNodeInstanceRepository {
    return this._flowNodeInstanceRepository;
  }

  private get iamService(): IIAMService {
    return this._iamService;
  }

  public async getRuntimeInformationForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    const flowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = await this.flowNodeInstanceRepository.queryByProcessModel(processModelId);

    const groupedFlowNodeInstances: GroupedFlowNodeInstances = this._groupFlowNodeInstancesByFlowNodeId(flowNodeInstances);

    const groupKeys: Array<string> = Object.keys(groupedFlowNodeInstances);

    const runtimeInformations: Array<FlowNodeRuntimeInformation> =
      groupKeys.map((flowNodeId: string): FlowNodeRuntimeInformation => {
        return this._createFlowNodeRuntimeInformation(flowNodeId, groupedFlowNodeInstances[flowNodeId]);
      });

    return Promise.resolve(runtimeInformations);
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    const flowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = await this.flowNodeInstanceRepository.queryByFlowNodeId(flowNodeId);

    const flowNodeRuntimeInformation: FlowNodeRuntimeInformation = this._createFlowNodeRuntimeInformation(flowNodeId, flowNodeInstances);

    return flowNodeRuntimeInformation;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<ActiveToken>> {

    const flowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = await this.flowNodeInstanceRepository.queryByProcessModel(processModelId);

    const activeFlowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = flowNodeInstances.filter(this._isFlowNodeInstanceActive);

    const activeTokenInfos: Array<ActiveToken> = activeFlowNodeInstances.map(this._createActiveTokenInfoForFlowNodeInstance);

    return activeTokenInfos;
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<ActiveToken>> {

    const flowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = await this.flowNodeInstanceRepository.queryByFlowNodeId(flowNodeId);

    const activeFlowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = flowNodeInstances.filter(this._isFlowNodeInstanceActive);

    const activeTokenInfos: Array<ActiveToken> = activeFlowNodeInstances.map(this._createActiveTokenInfoForFlowNodeInstance);

    return activeTokenInfos;
  }

  /**
   * Takes a list of FlowNodeInstances and groups them by their FlowNodeId.
   *
   * @param   flowNodeInstances The FlowNodeInstances to group.
   * @returns                   The grouped FlowNodeInstances.
   */
  private _groupFlowNodeInstancesByFlowNodeId(flowNodeInstances: Array<Runtime.Types.FlowNodeInstance>): GroupedFlowNodeInstances {

    const groupedFlowNodeInstances: GroupedFlowNodeInstances = {};

    for (const flowNodeInstance of flowNodeInstances) {

      const groupHasNoMatchingEntry: boolean = !groupedFlowNodeInstances[flowNodeInstance.flowNodeId];

      if (!groupHasNoMatchingEntry) {
        groupedFlowNodeInstances[flowNodeInstance.flowNodeId] = [];
      }

      groupedFlowNodeInstances[flowNodeInstance.flowNodeId].push(flowNodeInstance);
    }

    return groupedFlowNodeInstances;
  }

  /**
   * Takes an Array of FlowNodeInstances and evaluates their runtimes.
   * The results will be placed in a FlowNodeRuntimeInformation object.
   *
   * @param   flowNodeId        The ID of the FlowNode to evaluate.
   * @param   flowNodeInstances The list of instances to evaluate.
   * @returns                   The FlowNodeRuntimeInformation for the FlowNode.
   */
  private _createFlowNodeRuntimeInformation(flowNodeId: string,
                                            flowNodeInstances: Array<Runtime.Types.FlowNodeInstance>,
                                           ): FlowNodeRuntimeInformation {

    // WIP
    const runtimeInformation: FlowNodeRuntimeInformation = new FlowNodeRuntimeInformation();
    runtimeInformation.flowNodeId = flowNodeId;
    runtimeInformation.processModelId = flowNodeInstances[0].tokens[0].processModelId;

    return runtimeInformation;
  }

  /**
   * Checks if a given FlowNode instance is currently in an active state.
   *
   * @param   flowNodeInstance The FlowNode for which to determine the state.
   * @returns                  True, if the instance is active, otherwise false.
   */
  private _isFlowNodeInstanceActive(flowNodeInstance: Runtime.Types.FlowNodeInstance): boolean {
    return flowNodeInstance.state === Runtime.Types.FlowNodeInstanceState.running
      || flowNodeInstance.state === Runtime.Types.FlowNodeInstanceState.suspended;
  }

  /**
   * Converts the given FlowNodeInstance object into an ActiveToken object.
   *
   * @param   flowNodeInstance The FlowNodeInstance to convert.
   * @returns                  The created ActiveToken.
   */
  private _createActiveTokenInfoForFlowNodeInstance(flowNodeInstance: Runtime.Types.FlowNodeInstance): ActiveToken {

    const currentProcessToken: Runtime.Types.ProcessToken = flowNodeInstance.tokens[0];

    const activeTokenInfo: ActiveToken = new ActiveToken();
    activeTokenInfo.processInstanceId = currentProcessToken.processInstanceId;
    activeTokenInfo.processModelId = currentProcessToken.processModelId;
    activeTokenInfo.correlationId = currentProcessToken.correlationId;
    activeTokenInfo.flowNodeId = flowNodeInstance.flowNodeId;
    activeTokenInfo.flowNodeInstanceId = flowNodeInstance.id;
    activeTokenInfo.identity = currentProcessToken.identity;
    activeTokenInfo.createdAt = currentProcessToken.createdAt;
    activeTokenInfo.payload = currentProcessToken.payload;

    return activeTokenInfo;
  }
}
