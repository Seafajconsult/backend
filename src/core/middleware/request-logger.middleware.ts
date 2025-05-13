import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LoggingService } from "../services/logging.service";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;

    res.on("finish", () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;

      this.loggingService.log("info", "HTTP Request", {
        method,
        url: originalUrl,
        statusCode,
        responseTime: `${responseTime}ms`,
        ip,
        userAgent: headers["user-agent"],
      });

      // Log potentially suspicious requests
      if (statusCode >= 400) {
        this.loggingService.warn("Suspicious Request", {
          method,
          url: originalUrl,
          statusCode,
          ip,
          headers: {
            "user-agent": headers["user-agent"],
            "x-forwarded-for": headers["x-forwarded-for"],
            "x-real-ip": headers["x-real-ip"],
          },
        });
      }
    });

    next();
  }
}
