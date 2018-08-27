import {ILoggingRepository, LogLevel} from '@process-engine/logging_api_contracts';
import {IMetricsService, ProcessToken} from '@process-engine/metrics_api_contracts';

export class MetricsService implements IMetricsService {

  private _loggingRepository: ILoggingRepository;

  constructor(loggingRepository: ILoggingRepository) {
    this._loggingRepository = loggingRepository;
  }

  private get loggingRepository(): ILoggingRepository {
    return this._loggingRepository;
  }

  public async writeOnProcessStarted(correlationId: string, processModelId: string, timestamp: Date): Promise<void> {
    await this.loggingRepository.writeLogForProcessModel(correlationId, processModelId, LogLevel.info, 'Process started', timestamp);
  }

  public async writeOnProcessFinished(correlationId: string, processModelId: string, timestamp: Date): Promise<void> {
    await this.loggingRepository.writeLogForProcessModel(correlationId, processModelId, LogLevel.info, 'Process finished', timestamp);
  }

  public async writeOnProcessError(correlationId: string, processModelId: string, timestamp: Date): Promise<void> {
    await this.loggingRepository.writeLogForProcessModel(correlationId, processModelId, LogLevel.info, 'Process Error', timestamp);
  }

  public async writeOnFlowNodeInstanceEnter(correlationId: string,
                                            processModelId: string,
                                            flowNodeInstanceId: string,
                                            flowNodeId: string,
                                            processToken: ProcessToken,
                                            timestamp: Date): Promise<void> {

    const logMessage: string = this._createLogMessage('FNI Entered', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  public async writeOnFlowNodeInstanceExit(correlationId: string,
                                           processModelId: string,
                                           flowNodeInstanceId: string,
                                           flowNodeId: string,
                                           processToken: ProcessToken,
                                           timestamp: Date): Promise<void> {

    const logMessage: string = this._createLogMessage('FNI Exited', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  public async writeOnFlowNodeInstanceError(correlationId: string,
                                            processModelId: string,
                                            flowNodeInstanceId: string,
                                            flowNodeId: string,
                                            processToken: ProcessToken,
                                            timestamp: Date): Promise<void> {

    const logMessage: string = this._createLogMessage('FNI Error', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  public async writeOnFlowNodeInstanceSuspend(correlationId: string,
                                              processModelId: string,
                                              flowNodeInstanceId: string,
                                              flowNodeId: string,
                                              processToken: ProcessToken,
                                              timestamp: Date): Promise<void> {

    const logMessage: string = this._createLogMessage('FNI Suspended', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  public async writeOnFlowNodeInstanceResume(correlationId: string,
                                             processModelId: string,
                                             flowNodeInstanceId: string,
                                             flowNodeId: string,
                                             processToken: ProcessToken,
                                             timestamp: Date): Promise<void> {

    const logMessage: string = this._createLogMessage('FNI Resumed', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  private _createLogMessage(metricTypeMessage: string, processToken: ProcessToken): string {

    const stringifiedProcessToken: string = JSON.stringify(processToken);
    const message: string = `${metricTypeMessage};FlowNodeInstanceToken=${stringifiedProcessToken}`;

    return message;
  }
}
