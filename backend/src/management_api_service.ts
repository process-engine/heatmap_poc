import {IIdentity} from '@essential-projects/iam_contracts';

import {ActiveToken, FlowNodeRuntimeInformation, IKpiApiService} from '@process-engine/kpi_api_contracts';
import {ILoggingService, LogEntry} from '@process-engine/logging_api_contracts';
import {ITokenHistoryService, TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

import {
  ManagementContext,
} from '@process-engine/management_api_contracts';
import {
  ExecutionContext,
  IExecutionContextFacade,
  IExecutionContextFacadeFactory,
} from '@process-engine/process_engine_contracts';

export class ManagementApiService {
  public config: any = undefined;

  private _executionContextFacadeFactory: IExecutionContextFacadeFactory;
  private _kpiApiService: IKpiApiService;
  private _loggingApiService: ILoggingService;
  private _tokenHistoryApiService: ITokenHistoryService;

  constructor(executionContextFacadeFactory: IExecutionContextFacadeFactory,
              kpiApiService: IKpiApiService,
              loggingApiService: ILoggingService,
              tokenHistoryApiService: ITokenHistoryService) {

    this._executionContextFacadeFactory = executionContextFacadeFactory;
    this._kpiApiService = kpiApiService;
    this._loggingApiService = loggingApiService;
    this._tokenHistoryApiService = tokenHistoryApiService;
  }

  private get executionContextFacadeFactory(): IExecutionContextFacadeFactory {
    return this._executionContextFacadeFactory;
  }

  private get kpiApiService(): IKpiApiService {
    return this._kpiApiService;
  }

  private get loggingApiService(): ILoggingService {
    return this._loggingApiService;
  }

  private get tokenHistoryApiService(): ITokenHistoryService {
    return this._tokenHistoryApiService;
  }

  public async getRuntimeInformationForProcessModel(context: ManagementContext, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {
    const exectutionContext: IExecutionContextFacade = await this._createExecutionContextFacadeFromManagementContext(context);
    const identity: IIdentity = exectutionContext.getIdentity();

    return this.kpiApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(context: ManagementContext,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {
    const exectutionContext: IExecutionContextFacade = await this._createExecutionContextFacadeFromManagementContext(context);
    const identity: IIdentity = exectutionContext.getIdentity();

    return this.kpiApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(context: ManagementContext, processModelId: string): Promise<Array<ActiveToken>> {
    const exectutionContext: IExecutionContextFacade = await this._createExecutionContextFacadeFromManagementContext(context);
    const identity: IIdentity = exectutionContext.getIdentity();

    return this.kpiApiService.getActiveTokensForProcessModel(identity, processModelId);
  }

  public async getActiveTokensForFlowNode(context: ManagementContext, flowNodeId: string): Promise<Array<ActiveToken>> {
    const exectutionContext: IExecutionContextFacade = await this._createExecutionContextFacadeFromManagementContext(context);
    const identity: IIdentity = exectutionContext.getIdentity();

    return this.kpiApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getLogsForProcessModel(context: ManagementContext, correlationId: string, processModelId: string): Promise<Array<LogEntry>> {
    const exectutionContext: IExecutionContextFacade = await this._createExecutionContextFacadeFromManagementContext(context);
    const identity: IIdentity = exectutionContext.getIdentity();

    return this.loggingApiService.getLogsForProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForFlowNodeInstance(context: ManagementContext,
                                            processModelId: string,
                                            correlationId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {
    const exectutionContext: IExecutionContextFacade = await this._createExecutionContextFacadeFromManagementContext(context);
    const identity: IIdentity = exectutionContext.getIdentity();

    return this.tokenHistoryApiService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId);
  }

  private async _createExecutionContextFacadeFromManagementContext(managementContext: ManagementContext): Promise<IExecutionContextFacade> {
    const identity: IIdentity = {
      token: managementContext.identity,
    };
    const executionContext: ExecutionContext = new ExecutionContext(identity);

    return this.executionContextFacadeFactory.create(executionContext);
  }

}
