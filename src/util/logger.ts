import * as wins from 'winston';
// tslint:disable-next-line: no-duplicate-imports
import { createLogger, LoggerOptions, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';

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

  const options: LoggerOptions = {
    level: 'debug',
    format: combine(
      label({ label: labelsLog }),
      timestamp(),
      json(),
      myFormat,
    ),
    transports: [
      new winstonDailyRotateFile({
        filename: 'log-%DATE%.log',
        dirname: './logs',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        level: 'info',
      }),
      new transports.Console({
        level: 'debug',
        format: combine(
          label({ label: labelsLog }),
          colorize(),
          timestamp(),
          json(),
          myFormat,
        ),
      }),
    ],
  };
  return createLogger(options);
};
