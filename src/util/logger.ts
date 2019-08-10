import * as wins from 'winston';
// tslint:disable-next-line: no-duplicate-imports
import { createLogger, LoggerOptions, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import config from '../config';

const {
  combine, timestamp, printf, colorize, label, json,
} = wins.format;

const myFormat = printf(({
  // @ts-ignore
  // tslint:disable-next-line: no-shadowed-variable
  level, message, label, timestamp,
}) => `${timestamp} [${label}] <${level}> ${message}`);

export default (labels: string) => {
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
    transportz.push(
      new winstonDailyRotateFile({
        level: config.logging.level || 'info',
        filename: `${config.logging.fileName}-%DATE%.log`,
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
  return createLogger(options);
};
