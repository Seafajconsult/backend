"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfMiddleware = exports.SecurityHeadersMiddleware = void 0;
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const csurf = require("csurf");
let SecurityHeadersMiddleware = class SecurityHeadersMiddleware {
    constructor() {
        this.helmetMiddleware = (0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    scriptSrc: ["'self'"],
                },
            },
            crossOriginEmbedderPolicy: true,
            crossOriginOpenerPolicy: true,
            crossOriginResourcePolicy: { policy: "same-site" },
            dnsPrefetchControl: true,
            frameguard: { action: "deny" },
            hidePoweredBy: true,
            hsts: true,
            ieNoOpen: true,
            noSniff: true,
            referrerPolicy: { policy: "strict-origin-when-cross-origin" },
            xssFilter: true,
        });
    }
    use(req, res, next) {
        this.helmetMiddleware(req, res, next);
    }
};
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware;
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware = __decorate([
    (0, common_1.Injectable)()
], SecurityHeadersMiddleware);
let CsrfMiddleware = class CsrfMiddleware {
    constructor() {
        this.csrfProtection = csurf({
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            },
        });
    }
    use(req, res, next) {
        this.csrfProtection(req, res, next);
    }
};
exports.CsrfMiddleware = CsrfMiddleware;
exports.CsrfMiddleware = CsrfMiddleware = __decorate([
    (0, common_1.Injectable)()
], CsrfMiddleware);
//# sourceMappingURL=security.middleware.js.map