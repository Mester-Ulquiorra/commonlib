import winston from "winston";
import { format as formatDate } from "date-fns";
import clc from "cli-color";
import { join } from "path";
const dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";
function getColoredType(type) {
    switch (type) {
        case "info": return clc.blue("INFO");
        case "warn": return clc.xterm(208)("WARN");
        case "error": return clc.xterm(196)("ERROR");
        case "fatal": return clc.xterm(196).bgXterm(160).bold("FATAL");
    }
}
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp.toLocaleString()} ${level.toUpperCase()}]: ${message}`;
});
export class Logger {
    logsPath;
    loggers;
    constructor(logsPath) {
        this.logsPath = logsPath;
        this.loggers = {
            info: winston.createLogger({
                format: winston.format.combine(winston.format.timestamp(), logFormat),
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "info.log"),
                        level: "info"
                    }),
                ],
            }),
            warn: winston.createLogger({
                format: winston.format.combine(winston.format.timestamp(), logFormat),
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "warn.log"),
                        level: "warn"
                    }),
                ],
            }),
            error: winston.createLogger({
                format: winston.format.combine(winston.format.timestamp(), logFormat),
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "error.log"),
                        level: "error"
                    }),
                ],
            }),
            fatal: winston.createLogger({
                format: winston.format.combine(winston.format.timestamp(), logFormat),
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "fatal.log"),
                        level: "fatal"
                    }),
                ],
            }),
        };
    }
    log(message, type = "info") {
        this.loggers[type].log({
            level: type,
            message: message
        });
        console.log(`[${formatDate(new Date(), dateFormat)} ${getColoredType(type)}]: ${message}`);
    }
}
