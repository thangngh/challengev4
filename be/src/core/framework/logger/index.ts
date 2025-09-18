import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

class Logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
      });

      Logger.instance = winston.createLogger({
        level: CONFIG.logger.level,
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          logFormat,
        ),
        transports: [

          new winston.transports.Console({ handleExceptions: true }),

          new DailyRotateFile({
            dirname: CONFIG.logger.appLogsDir,
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            level: 'info',
            maxSize: CONFIG.logger.maxSize,
            maxFiles: CONFIG.logger.maxFiles,
          }),
          new DailyRotateFile({
            dirname: CONFIG.logger.appLogsDir,
            filename: 'warn-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            level: 'warn',
            maxSize: CONFIG.logger.maxSize,
            maxFiles: CONFIG.logger.maxFiles,
          }),

          new DailyRotateFile({
            dirname: CONFIG.logger.errorLogsDir,
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            level: 'error',
            maxSize: CONFIG.logger.maxSize,
            maxFiles: CONFIG.logger.maxFiles,
          }),
        ],
        exitOnError: false,
      });
    }
    return Logger.instance;
  }
}

export const LOGGER = Logger.getInstance();
