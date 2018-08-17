import {ILoggingRepository, LogEntry, LogLevel} from '@process-engine/logging_api_contracts';

export class LoggingRepository implements ILoggingRepository {

  public async getLogsForCorrelation(correlationId: string): Promise<Array<LogEntry>> {
    throw new Error('Method not implemented.');
  }

  public async getLogsForProcessModel(correlationId: string, processModelId: string): Promise<Array<LogEntry>> {
    throw new Error('Method not implemented.');
  }

  public async writeLogForProcessModel(correlationId: string,
                                       processModelId: string,
                                       logLevel: LogLevel,
                                       message: string,
                                       timestamp: Date): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async writeLogForFlowNode(correlationId: string,
                                   processModelId: string,
                                   flowNodeInstanceId: string,
                                   logLevel: LogLevel,
                                   message: string,
                                   timestamp: Date): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
