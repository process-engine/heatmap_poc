import {ITokenHistoryApiService, TokenEventType, TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

import {IFlowNodeInstanceRepository, Runtime} from '@process-engine/process_engine_contracts';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

export class TokenHistoryApiService implements ITokenHistoryApiService {

  private _iamService: IIAMService;
  private _flowNodeInstanceRepository: IFlowNodeInstanceRepository;

  constructor(iamService: IIAMService, flowNodeInstanceRepository: IFlowNodeInstanceRepository) {
    this._iamService = iamService;
    this._flowNodeInstanceRepository = flowNodeInstanceRepository;
  }

  private get iamService(): IIAMService {
    return this._iamService;
  }

  private get flowNodeInstanceRepository(): IFlowNodeInstanceRepository {
    return this._flowNodeInstanceRepository;
  }

  // TODO: Add claim checks as soon as required claims have been defined.
  public async getTokensForFlowNode(identity: IIdentity,
                                    correlationId: string,
                                    processModelId: string,
                                    flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    // TODO: Add a queryBy function to the repository, which allows to query FlowNodeInstances by correlation, processModelId and flowNodeId.
    const flowNodeInstances: Array<Runtime.Types.FlowNodeInstance> = await this.flowNodeInstanceRepository.queryByCorrelation(correlationId);

    const matchingFlowNodeInstance: Runtime.Types.FlowNodeInstance = flowNodeInstances.find((entry: Runtime.Types.FlowNodeInstance): boolean => {

      // Note that processModelId will be the same for every token, so it is sufficient to just check the first.
      return entry.flowNodeId === flowNodeId &&
             entry.tokens[0].processModelId === processModelId;
    });

    const tokenHistory: Array<TokenHistoryEntry> = matchingFlowNodeInstance.tokens.map((fniToken: Runtime.Types.ProcessToken): TokenHistoryEntry => {

      const tokenHistoryEntry: TokenHistoryEntry = new TokenHistoryEntry();
      tokenHistoryEntry.flowNodeId = matchingFlowNodeInstance.flowNodeId;
      tokenHistoryEntry.flowNodeInstanceId = matchingFlowNodeInstance.id;
      tokenHistoryEntry.processInstanceId = fniToken.processInstanceId;
      tokenHistoryEntry.processModelId = fniToken.processModelId;
      tokenHistoryEntry.correlationId = fniToken.correlationId;
      tokenHistoryEntry.tokenEventType = TokenEventType[fniToken.type];
      tokenHistoryEntry.identity = fniToken.identity;
      tokenHistoryEntry.createdAt = fniToken.createdAt;
      tokenHistoryEntry.caller = fniToken.caller;
      tokenHistoryEntry.payload = fniToken.payload;

      return tokenHistoryEntry;
    });

    return tokenHistory;
  }
}
