import winston from "winston";

const handleLogFile = () => {
    const { combine, timestamp, printf, colorize, align } = winston.format;

    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: combine(
            colorize({ all: true }),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            align(),
            printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
        transports: [new winston.transports.Console()],
    });

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // month is zero-based
    let dd = today.getDate();
    
    console.log({today})
    logger.add(new winston.transports.File({ filename: `./logs/attendance_${mm}_${dd}_${yyyy}.log` }));

    return logger;
}

export const logFile = handleLogFile();