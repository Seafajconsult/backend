"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./filters/all-exceptions.filter");
const logging_service_1 = require("./services/logging.service");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const security_middleware_1 = require("./middleware/security.middleware");
let CoreModule = class CoreModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes("*");
        consumer.apply(security_middleware_1.SecurityHeadersMiddleware).forRoutes("*");
        consumer
            .apply(security_middleware_1.CsrfMiddleware)
            .exclude({ path: "api/auth/csrf-token", method: common_1.RequestMethod.GET }, { path: "api/auth/login", method: common_1.RequestMethod.POST }, { path: "api/auth/register", method: common_1.RequestMethod.POST })
            .forRoutes("*");
        consumer
            .apply(rate_limit_middleware_1.AuthRateLimitMiddleware)
            .forRoutes({ path: "api/auth/login", method: common_1.RequestMethod.POST }, { path: "api/auth/register", method: common_1.RequestMethod.POST });
        consumer
            .apply(rate_limit_middleware_1.OtpRateLimitMiddleware)
            .forRoutes({ path: "api/auth/send-otp", method: common_1.RequestMethod.POST }, { path: "api/auth/verify-otp", method: common_1.RequestMethod.POST });
    }
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            logging_service_1.LoggingService,
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
        ],
        exports: [logging_service_1.LoggingService],
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map