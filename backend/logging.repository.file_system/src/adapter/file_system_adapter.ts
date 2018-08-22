import {LogEntry, LogLevel} from '@process-engine/logging_api_contracts';

import * as fs from 'fs';
import * as path from 'path';

export function targetExists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
}

export function ensureDirectoryExists(targetFilePath: string): void {

  const parsedPath: path.ParsedPath = path.parse(targetFilePath);

  const targetDirectoryExists: boolean = fs.existsSync(parsedPath.dir);

  if (!targetDirectoryExists) {
    fs.mkdirSync(parsedPath.dir);
  }
}

export function writeToLogFile(targetFilePath: string, entry: string): void {
  fs.writeFileSync(targetFilePath, entry, 'utf-8');
}

export function readAndParseDirectory(dirPath: string): Array<LogEntry> {

  const logfileNames: Array<string> = fs.readdirSync(dirPath);

  const correlationLogs: Array<LogEntry> = [];

  for (const fileName of logfileNames) {
    const logFileEntries: Array<LogEntry> = readAndParseFile(fileName);
    Array.prototype.push.apply(correlationLogs, logFileEntries);
  }

  return correlationLogs;
}

export function readAndParseFile(filePath: string): Array<LogEntry> {

  const logFileContent: string = fs.readFileSync(filePath, 'utf-8');

  const logEntriesRaw: Array<string> = logFileContent.split('\n');

  const logEntries: Array<LogEntry> = logEntriesRaw.map(_createLogEntryFromRawData);

  return logEntries;
}

// tslint:disable:no-magic-numbers
function _createLogEntryFromRawData(logEntryRaw: string): LogEntry {

  const logEntryRawParts: Array<string> = logEntryRaw.split('\t');

  const isFlowNodeInstanceLog: boolean = logEntryRawParts.length === 7;

  const logEntry: LogEntry = isFlowNodeInstanceLog
    ? _parseFlowNodeInstanceLog(logEntryRawParts)
    : _parseProcessModelLog(logEntryRawParts);

  return logEntry;
}

function _parseFlowNodeInstanceLog(rawData: Array<string>): LogEntry {

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

function _parseProcessModelLog(rawData: Array<string>): LogEntry {

  const logEntry: LogEntry = new LogEntry();
  logEntry.timeStamp = new Date(rawData[0]);
  logEntry.correlationId = rawData[1];
  logEntry.processModelId = rawData[2];
  logEntry.logLevel = LogLevel[rawData[3]];
  logEntry.message = rawData[4];

  return logEntry;
}
