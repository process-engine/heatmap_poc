import {ILoggingRepository, LogEntry, LogLevel} from '@process-engine/logging_api_contracts';

import * as fs from 'fs';
import * as path from 'path';

export class LoggingRepository implements ILoggingRepository {

  public config: any;

  public async getLogsForCorrelation(correlationId: string): Promise<Array<LogEntry>> {

    const folderPath: string = this._buildPath(correlationId);

    const logfileNames: Array<string> = fs.readdirSync(folderPath);

    const correlationLogs: Array<LogEntry> = [];

    for (const fileName of logfileNames) {
      const logFileEntries: Array<LogEntry> = this._readAndParseFile(fileName);
      Array.prototype.push.apply(correlationLogs, logFileEntries);
    }

    return correlationLogs;
  }

  public async getLogsForProcessModel(correlationId: string, processModelId: string): Promise<Array<LogEntry>> {

    const logFilePath: string = this._buildPath(correlationId, processModelId);

    const logFileExists: boolean = fs.existsSync(logFilePath);
    if (!logFileExists) {
      return [];
    }

    const correlationLogs: Array<LogEntry> = this._readAndParseFile(logFilePath);

    return correlationLogs;
  }

  public async writeLogForProcessModel(correlationId: string,
                                       processModelId: string,
                                       logLevel: LogLevel,
                                       message: string,
                                       timestamp: Date): Promise<void> {
    return Promise.resolve();
  }

  public async writeLogForFlowNode(correlationId: string,
                                   processModelId: string,
                                   flowNodeInstanceId: string,
                                   flowNodeId: string,
                                   logLevel: LogLevel,
                                   message: string,
                                   timestamp: Date): Promise<void> {
    return Promise.resolve();
  }

  private _buildPath(...pathSegments: Array<string>): string {
    return path.resolve(process.cwd(), this.config.log_output_path, ...pathSegments);
  }

  private _readAndParseFile(filePath: string): Array<LogEntry> {

    const logFileContent: string = fs.readFileSync(filePath, 'utf-8');

    const logEntriesRaw: Array<string> = logFileContent.split('\n');

    const logEntries: Array<LogEntry> = logEntriesRaw.map(this._createLogEntryFromRawData);

    return logEntries;

  }

  // tslint:disable:no-magic-numbers
  private _createLogEntryFromRawData(logEntryRaw: string): LogEntry {

    const logEntryRawParts: Array<string> = logEntryRaw.split('\t');

    const isFlowNodeInstanceLog: boolean = logEntryRawParts.length === 7;

    const logEntry: LogEntry = isFlowNodeInstanceLog
      ? this._parseFlowNodeInstanceLog(logEntryRawParts)
      : this._parseProcessModelLog(logEntryRawParts);

    return logEntry;
  }

  private _parseFlowNodeInstanceLog(rawData: Array<string>): LogEntry {

    const logEntry: LogEntry = new LogEntry();
    logEntry.timeStamp = new Date(rawData[0]);
    logEntry.correlationId = rawData[1];
    logEntry.processModelId = rawData[2];
    logEntry.flowNodeInstanceId = rawData[3];
    logEntry.flowNodeId = rawData[4];
    logEntry.logLevel = LogLevel[rawData[5]];
    logEntry.message = rawData[6];

    return logEntry;
  }

  private _parseProcessModelLog(rawData: Array<string>): LogEntry {

    const logEntry: LogEntry = new LogEntry();
    logEntry.timeStamp = new Date(rawData[0]);
    logEntry.correlationId = rawData[1];
    logEntry.processModelId = rawData[2];
    logEntry.logLevel = LogLevel[rawData[3]];
    logEntry.message = rawData[4];

    return logEntry;
  }

}
