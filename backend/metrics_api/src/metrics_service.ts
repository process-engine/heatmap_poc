import {ILoggingRepository, LogLevel} from '@process-engine/logging_api_contracts';
import {IMetricsService} from '@process-engine/metrics_api_contracts';

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
                                            timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, 'FNI Entered', timestamp);
  }

  public async writeOnFlowNodeInstanceExit(correlationId: string,
                                           processModelId: string,
                                           flowNodeInstanceId: string,
                                           flowNodeId: string,
                                           timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, 'FNI Exited', timestamp);
  }

  public async writeOnFlowNodeInstanceError(correlationId: string,
                                            processModelId: string,
                                            flowNodeInstanceId: string,
                                            flowNodeId: string,
                                            timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, 'FNI Error', timestamp);
  }

  public async writeOnFlowNodeInstanceSuspend(correlationId: string,
                                              processModelId: string,
                                              flowNodeInstanceId: string,
                                              flowNodeId: string,
                                              timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, 'FNI Suspended', timestamp);
  }

  public async writeOnFlowNodeInstanceResume(correlationId: string,
                                             processModelId: string,
                                             flowNodeInstanceId: string,
                                             flowNodeId: string,
                                             timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, flowNodeInstanceId, flowNodeId, LogLevel.info, 'FNI Resumed', timestamp);
  }
}
