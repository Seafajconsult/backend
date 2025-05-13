import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LoggingService } from "../services/logging.service";
export declare class RequestLoggerMiddleware implements NestMiddleware {
    private readonly loggingService;
    constructor(loggingService: LoggingService);
    use(req: Request, res: Response, next: NextFunction): void;
}
