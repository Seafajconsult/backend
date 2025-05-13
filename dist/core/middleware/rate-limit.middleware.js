"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRateLimitMiddleware = exports.AuthRateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const express_rate_limit_1 = require("express-rate-limit");
let AuthRateLimitMiddleware = class AuthRateLimitMiddleware {
    constructor() {
        this.limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 5,
            message: "Too many login attempts from this IP, please try again after 15 minutes",
            standardHeaders: true,
            legacyHeaders: false,
        });
    }
    use(req, res, next) {
        this.limiter(req, res, next);
    }
};
exports.AuthRateLimitMiddleware = AuthRateLimitMiddleware;
exports.AuthRateLimitMiddleware = AuthRateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], AuthRateLimitMiddleware);
let OtpRateLimitMiddleware = class OtpRateLimitMiddleware {
    constructor() {
        this.limiter = (0, express_rate_limit_1.default)({
            windowMs: 60 * 60 * 1000,
            max: 3,
            message: "Too many OTP requests from this IP, please try again after an hour",
            standardHeaders: true,
            legacyHeaders: false,
        });
    }
    use(req, res, next) {
        this.limiter(req, res, next);
    }
};
exports.OtpRateLimitMiddleware = OtpRateLimitMiddleware;
exports.OtpRateLimitMiddleware = OtpRateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], OtpRateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map