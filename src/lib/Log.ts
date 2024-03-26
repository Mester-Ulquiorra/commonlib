import winston from "winston";
import { format as formatDate } from "date-fns";
import clc from "cli-color";
import { join } from "path";

export type LogType = "info" | "warn" | "error" | "fatal";

const dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";

function getColoredType(type: LogType) {
    switch (type) {
        case "info":
            return clc.blue("INFO");
        case "warn":
            return clc.xterm(208)("WARN");
        case "error":
            return clc.xterm(196)("ERROR");
        case "fatal":
            return clc.xterm(196).bgXterm(160).bold("FATAL");
    }
}

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    //@ts-expect-error this works, shut up
    winston.format.printf(({ level, message, timestamp }: { level: string; message: string; timestamp: Date }) => {
        return `[${timestamp.toLocaleString()} ${level.toUpperCase()}]: ${message}`;
    })
);

/**
 * A universal logger class.
 */
export class Logger {
    /**
     * The path to the logs folder.
     */
    logsPath: string;

    /**
     * The logger objects for each log level.
     */
    loggers: Record<LogType, winston.Logger>;

    constructor(logsPath: string) {
        this.logsPath = logsPath;

        this.loggers = {
            info: winston.createLogger({
                format: logFormat,
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "info.log"),
                        level: "info"
                    })
                ]
            }),
            warn: winston.createLogger({
                format: logFormat,
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "warn.log"),
                        level: "warn"
                    })
                ]
            }),
            error: winston.createLogger({
                format: logFormat,
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "error.log"),
                        level: "error"
                    })
                ]
            }),
            fatal: winston.createLogger({
                format: logFormat,
                transports: [
                    new winston.transports.File({
                        filename: join(this.logsPath, "fatal.log"),
                        level: "error"
                    })
                ]
            })
        };
    }

    /**
     * Logs a message to both the console and the logger.
     * @param message The message to log.
     * @param type The type of the message.
     */
    log(message: string, type: LogType = "info") {
        this.loggers[type].log({
            level: type === "fatal" ? "error" : type,
            message: message
        });
        console.log(`[${formatDate(new Date(), dateFormat)} ${getColoredType(type)}]: ${message}`);
    }
}
