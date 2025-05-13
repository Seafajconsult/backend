import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class SecurityHeadersMiddleware implements NestMiddleware {
    private helmetMiddleware;
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare class CsrfMiddleware implements NestMiddleware {
    private csrfProtection;
    use(req: Request, res: Response, next: NextFunction): void;
}
