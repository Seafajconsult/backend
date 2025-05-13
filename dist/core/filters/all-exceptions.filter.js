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
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../services/logging.service");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : "Internal server error";
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === "string"
                ? message
                : message["message"] || "Internal server error",
            ...(typeof message === "object" && message),
        };
        this.loggingService.error("Request Error", exception instanceof Error ? exception.stack : undefined, {
            statusCode: status,
            path: request.url,
            method: request.method,
            body: request.body,
            params: request.params,
            query: request.query,
            headers: {
                "user-agent": request.headers["user-agent"],
                "x-forwarded-for": request.headers["x-forwarded-for"],
            },
        });
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map