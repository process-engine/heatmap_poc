import {ILoggingRepository, LogLevel} from '@process-engine/logging_api_contracts';
import {IMetricsService, ProcessToken} from '@process-engine/metrics_api_contracts';

export class MetricsApiService implements IMetricsService {

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

  public async writeOnProcessError(correlationId: string, processModelId: string, error: Error, timestamp: Date): Promise<void> {
    const logMessage: string = `Process Error;Error=${error}`;
    await this.loggingRepository.writeLogForProcessModel(correlationId, processModelId, LogLevel.info, logMessage, timestamp);
  }

  public async writeOnFlowNodeInstanceEnter(correlationId: string,
                                            processModelId: string,
                                            flowNodeInstanceId: string,
                                            flowNodeId: string,
                                            processToken: ProcessToken,
                                            timestamp: Date): Promise<void> {

    const logMessage: string = this._createFlowNodeInstanceLogMessage('FNI Entered', processToken);

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

    const logMessage: string = this._createFlowNodeInstanceLogMessage('FNI Exited', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  public async writeOnFlowNodeInstanceError(correlationId: string,
                                            processModelId: string,
                                            flowNodeInstanceId: string,
                                            flowNodeId: string,
                                            processToken: ProcessToken,
                                            error: Error,
                                            timestamp: Date): Promise<void> {

    const logMessage: string = this._createFlowNodeInstanceLogMessage('FNI Error', processToken, error);

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

    const logMessage: string = this._createFlowNodeInstanceLogMessage('FNI Suspended', processToken);

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

    const logMessage: string = this._createFlowNodeInstanceLogMessage('FNI Resumed', processToken);

    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, logMessage, timestamp);
  }

  private _createFlowNodeInstanceLogMessage(metricTypeMessage: string, processToken: ProcessToken, error?: Error): string {

    const stringifiedProcessToken: string = JSON.stringify(processToken);
    let message: string = `${metricTypeMessage};FlowNodeInstanceToken=${stringifiedProcessToken}`;

    if (error) {
      message += `;Error=${error}`;
    }

    return message;
  }
}
