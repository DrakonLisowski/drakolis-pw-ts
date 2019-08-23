import * as wins from 'winston';
// tslint:disable-next-line: no-duplicate-imports
import { createLogger, LoggerOptions, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import config from '../config';

interface IDrakolisLogger extends wins.Logger {
  exception(description: string, err: any): void;
  addLabel(label: string): IDrakolisLogger;
}

const {
  combine, timestamp, printf, colorize, label, json,
} = wins.format;

const myFormat = printf(({
  // @ts-ignore
  // tslint:disable-next-line: no-shadowed-variable
  level, message, label, timestamp,
}) => `${timestamp} [${label}] <${level}> ${message}`);

const loggerConstructor = (labels: string | string[], fileNameOverride: string = null) => {
  const labelsLog = Array.isArray(labels) ? labels : [labels].join(' ');
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
      }),
    );
  }

  const options: LoggerOptions = {
    level: config.logging.level || 'info',
    format: combine(
      label({ label: labelsLog }),
      timestamp(),
      json(),
      myFormat,
    ),
    transports: transportz,
  };
  const logger = createLogger(options) as IDrakolisLogger;

  logger.error = (err: any) =>
    logger.log('error', err.stack || err.message || err || 'We are doomed...');

  logger.exception = (description: string, err: any) => {
    logger.error(description);
    logger.error(err);
  };

  logger.addLabel = (lab: string) => loggerConstructor([...labelsLog, lab]);

  return logger;
};

export default loggerConstructor;
