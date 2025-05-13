import { Injectable } from "@nestjs/common";
import { createLogger, format, transports } from "winston";

@Injectable()
export class LoggingService {
  private logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" }),
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  });

  private auditLogger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({ filename: "logs/audit.log" })],
  });

  log(level: string, message: string, meta?: any) {
    this.logger.log(level, message, meta);
  }

  error(message: string, trace?: string, meta?: any) {
    this.logger.error(message, { trace, ...meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  audit(action: string, userId: string, details: any) {
    this.auditLogger.info("Audit Log", {
      action,
      userId,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
