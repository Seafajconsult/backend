export declare class LoggingService {
    private logger;
    private auditLogger;
    log(level: string, message: string, meta?: any): void;
    error(message: string, trace?: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    audit(action: string, userId: string, details: any): void;
}
