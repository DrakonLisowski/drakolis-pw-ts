import * as wins from 'winston';
import { highlight, Theme, plain } from 'cli-highlight';
import stripAnsi from 'strip-ansi';
// tslint:disable-next-line: no-duplicate-imports
import { createLogger, LoggerOptions, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import config, { LogLevel } from '../config';

type SupportedSyntaxes = 'sql'|'javascript'|'typescript'|'js';

class SyntaxEntryExtra {
  public prefix?: string;
  public postfix?: string;
}

export interface IDrakolisLogger extends wins.Logger {
  exception(description: string, err: any): void;
  addLabel(label: string): IDrakolisLogger;

  syntax(
    level: LogLevel,
    syntax: SupportedSyntaxes,
    message: string,
    extra?: SyntaxEntryExtra,
  ): void;

  errorSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void;
  warnSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void;
  infoSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void;
  verboseSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void;
  debugSyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void;
  sillySyntax(syntax: SupportedSyntaxes, message: string, extra?: SyntaxEntryExtra): void;
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

const loggerConstructor = (labels: string | string[], fileNameOverride: string = null) => {
  const labelsLog = Array.isArray(labels) ? labels : [labels];
  const transportz = [];

  if (config.logging.console) {
    transportz.push(
      new transports.Console({
        level: config.logging.level || 'info',
        format: combine(
          label({ label: labelsLog }),
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
          label({ label: labelsLog }),
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
  const logger = createLogger(options) as IDrakolisLogger;

  logger.error = (err: any) =>
    logger.log('error', err.stack || err.message || err || 'We are doomed...');

  logger.exception = (description: string, err: any) => {
    logger.error(description);
    logger.error(err);
  };

  logger.syntax = (
    level: LogLevel,
    language: SupportedSyntaxes,
    message: string,
    extra: SyntaxEntryExtra,
  ) => {
    const messageHighlighted = highlight(message, { language, ignoreIllegals: true });
    logger.log(level, `${extra.prefix || ''} ${messageHighlighted} ${extra.postfix || ''}`.trim());
  };

  logger.errorSyntax = (syntax: SupportedSyntaxes, message: string, extra: SyntaxEntryExtra) => {
    logger.syntax('error', syntax, message, extra);
  };

  logger.warnSyntax = (syntax: SupportedSyntaxes, message: string, extra: SyntaxEntryExtra) => {
    logger.syntax('warn', syntax, message, extra);
  };

  logger.infoSyntax = (syntax: SupportedSyntaxes, message: string, extra: SyntaxEntryExtra) => {
    logger.syntax('info', syntax, message, extra);
  };

  logger.verboseSyntax = (syntax: SupportedSyntaxes, message: string, extra: SyntaxEntryExtra) => {
    logger.syntax('verbose', syntax, message, extra);
  };

  logger.debugSyntax = (syntax: SupportedSyntaxes, message: string, extra: SyntaxEntryExtra) => {
    logger.syntax('debug', syntax, message, extra);
  };

  logger.sillySyntax = (syntax: SupportedSyntaxes, message: string, extra: SyntaxEntryExtra) => {
    logger.syntax('silly', syntax, message, extra);
  };

  logger.addLabel = (lab: string) => loggerConstructor([...labelsLog, lab], fileNameOverride);

  return logger;
};

export default loggerConstructor;
