import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';

const { combine, timestamp, json, errors } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let logsDirectory: string;
if (fs.existsSync("/database")) {
    logsDirectory = "/database";
  } else {
    logsDirectory = path.resolve(__dirname, '../logs');
  }

const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false;
});

const warnFilter = winston.format((info, opts) => {
    return info.level === 'warn' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
    return info.level === 'info' ? info : false;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDirectory, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDirectory, 'app-error-%DATE%.log'),
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            format: combine(errorFilter(), timestamp(), json()),
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDirectory, 'app-warn-%DATE%.log'),
            level: 'warn',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            format: combine(warnFilter(), timestamp(), json()),
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDirectory, 'app-info-%DATE%.log'),
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            format: combine(infoFilter(), timestamp(), json()),
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(logsDirectory, 'exception.log') })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(logsDirectory, 'rejection.log') })
    ],
})