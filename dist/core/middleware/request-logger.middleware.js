"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../services/logging.service");
let RequestLoggerMiddleware = class RequestLoggerMiddleware {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    use(req, res, next) {
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
};
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
exports.RequestLoggerMiddleware = RequestLoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], RequestLoggerMiddleware);
//# sourceMappingURL=request-logger.middleware.js.map