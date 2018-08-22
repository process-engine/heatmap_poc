import {ILoggingRepository, LogEntry, LogLevel} from '@process-engine/logging_api_contracts';

import * as path from 'path';

import * as FileSystemAdapter from './adapter';

export class LoggingRepository implements ILoggingRepository {

  public config: any;

  public async getLogsForCorrelation(correlationId: string): Promise<Array<LogEntry>> {

    const folderPath: string = this._buildPath(correlationId);

    const correlationLogs: Array<LogEntry> = FileSystemAdapter.readAndParseDirectory(folderPath);

    return correlationLogs;
  }

  public async getLogsForProcessModel(correlationId: string, processModelId: string): Promise<Array<LogEntry>> {

    const logFilePath: string = this._buildPath(correlationId, processModelId);

    const logFileExists: boolean = FileSystemAdapter.targetExists(logFilePath);
    if (!logFileExists) {
      return [];
    }

    const correlationLogs: Array<LogEntry> = FileSystemAdapter.readAndParseFile(logFilePath);

    return correlationLogs;
  }

  public async writeLogForProcessModel(correlationId: string,
                                       processModelId: string,
                                       logLevel: LogLevel,
                                       message: string,
                                       timestamp: Date): Promise<void> {

    const logEntryAsString: string = [timestamp, correlationId, processModelId, logLevel, message].join('\t');
    this._writeLogEntryToFileSystem(correlationId, processModelId, logEntryAsString);
  }

  public async writeLogForFlowNode(correlationId: string,
                                   processModelId: string,
                                   flowNodeInstanceId: string,
                                   flowNodeId: string,
                                   logLevel: LogLevel,
                                   message: string,
                                   timestamp: Date): Promise<void> {

    const logEntryAsString: string = [timestamp, correlationId, processModelId, flowNodeInstanceId, flowNodeId, logLevel, message].join('\t');
    this._writeLogEntryToFileSystem(correlationId, processModelId, logEntryAsString);
  }

  private _writeLogEntryToFileSystem(correlationId: string, processModelId: string, entry: string): void {

    const targetFilePath: string = this._buildPath(correlationId, processModelId);

    FileSystemAdapter.ensureDirectoryExists(targetFilePath);
    FileSystemAdapter.writeToLogFile(targetFilePath, entry);
  }

  private _buildPath(...pathSegments: Array<string>): string {
    return path.resolve(process.cwd(), this.config.log_output_path, ...pathSegments);
  }

}
