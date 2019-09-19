import * as wins from 'winston';
import { highlight } from 'cli-highlight';
import stripAnsi from 'strip-ansi';
// tslint:disable-next-line: no-duplicate-imports
import { createLogger, LoggerOptions, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';

import config, { LogLevel } from '../../config';
import { IService } from '../IService';
import { Service } from '../ServiceDecorator';

type SupportedSyntaxes = 'sql'|'javascript'|'typescript'|'js'|'json';

class SyntaxEntryExtra {
  public prefix?: string;
  public postfix?: string;
}

const {
  combine, timestamp, printf, colorize, label, json,
} = wins.format;

const myFormat = printf(({
  // @ts-ignore
  // tslint:disable-next-line: no-shadowed-variable
  level, message, label, timestamp,
}) => `${timestamp} [${label}] <${level}> ${message}`);

const myFormatNoColor = printf(({
  // @ts-ignore
  // tslint:disable-next-line: no-shadowed-variable
  level, message, label, timestamp,
}) => `${timestamp} [${label}] <${level}> ${stripAnsi(message)}`);

// tslint:disable-next-line: max-classes-per-file
@Service()
export default class LoggerService implements IService {

  private winston: wins.Logger;
  private labels: string[];

  constructor() {
    const fileNameOverride = this.labels[0].replace(/:/g, '_');
    // Removed logging process name...
    const transportz = [];

    if (config.logging.console) {
      transportz.push(
        new transports.Console({
          level: config.logging.level || 'info',
          format: combine(
            label({ label: this.labels.join(' ') }),
            colorize(),
            timestamp(),
            json(),
            myFormat,
          ),
        }),
      );
    }

    if (config.logging.file) {
      const fileNamePrefix = fileNameOverride || config.logging.fileNamePrefix;
      const fileName = `${fileNamePrefix}@${config.logging.fileNamePostfix}`;
      transportz.push(
        new winstonDailyRotateFile({
          level: config.logging.level || 'info',
          filename: `${fileName}-%DATE%.log`,
          dirname: './logs',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          format: combine(
            label({ label: this.labels.join(' ') }),
            timestamp(),
            json(),
            myFormatNoColor,
          ),
        }),
      );
    }

    const options: LoggerOptions = {
      level: config.logging.level || 'info',
      transports: transportz,
    };
    this.winston = createLogger(options);
  }

  public async start(registry: any): Promise<boolean> {
    return true;
  }
  public isRunning(): boolean {
    return true;
  }
  public async stop(): Promise<boolean> {
    return true;
  }

  public log(level: LogLevel, message: string): void {
    this.winston.log(level, message);
  }

  public error(message: string|Error): void {
    // @ts-ignore
    this.log('error', message.stack || message.message || message || 'We are doomed...');
  }

  public warn(message: string): void {
    this.log('warn', message);
  }
  public info(message: string): void {
    this.log('info', message);
  }
  public verbose(message: string): void {
    this.log('verbose', message);
  }
  public debug(message: string): void {
    this.log('debug', message);
  }
  public silly(message: string): void {
    this.log('silly', message);
  }

  public exception(description: string, err: any): void {
    this.error(description);
    this.error(err);
  }

  public addLabel(addLabel: string): LoggerService {
    const newLogger = new LoggerService();
    newLogger.setLabels([...this.labels, addLabel]);
    return newLogger;
  }

  public syntax(
    level: LogLevel,
    syntax: SupportedSyntaxes,
    message: string,
    extra?: SyntaxEntryExtra,
  ): void {
    const messageHighlighted = highlight(message, { language: syntax, ignoreIllegals: true });
    this.log(level, `${extra.prefix || ''} ${messageHighlighted} ${extra.postfix || ''}`.trim());
  }

  public errorSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void {
    this.syntax('error', syntax, message, extra);
  }
  public warnSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void {
    this.syntax('warn', syntax, message, extra);
  }
  public infoSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void {
    this.syntax('info', syntax, message, extra);
  }
  public verboseSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void {
    this.syntax('verbose', syntax, message, extra);
  }
  public debugSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void {
    this.syntax('debug', syntax, message, extra);
  }
  public sillySyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void {
    this.syntax('silly', syntax, message, extra);
  }

  private setLabels(labels: string[]|string) {
    this.labels = Array.isArray(labels) ? labels : [labels];
  }
}
