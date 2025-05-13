import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class AuthRateLimitMiddleware implements NestMiddleware {
    private limiter;
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare class OtpRateLimitMiddleware implements NestMiddleware {
    private limiter;
    use(req: Request, res: Response, next: NextFunction): void;
}
