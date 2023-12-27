import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";
import 'winston-daily-rotate-file';

const handleLogFile = () => {
    const { combine, timestamp, printf, align } = winston.format;

    const __filename = fileURLToPath(import.meta.url);
    const logfilePath = process.env.SCRIPT_ATTENDANCE_LOG_PATH || path.join(__filename, '../../logs');

    const fileRotateTransport = new winston.transports.DailyRotateFile({
        filename:  `${logfilePath}/attendance-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '1d',
    });

    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            align(),
            printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
        transports: [fileRotateTransport],
    });

    return logger;
}

export const logFile = handleLogFile();