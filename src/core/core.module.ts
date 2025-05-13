import {
  Module,
  Global,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { LoggingService } from "./services/logging.service";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";
import {
  AuthRateLimitMiddleware,
  OtpRateLimitMiddleware,
} from "./middleware/rate-limit.middleware";
import {
  SecurityHeadersMiddleware,
  CsrfMiddleware,
} from "./middleware/security.middleware";

@Global()
@Module({
  providers: [
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [LoggingService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply request logging to all routes
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");

    // Apply security headers to all routes
    consumer.apply(SecurityHeadersMiddleware).forRoutes("*");

    // Apply CSRF protection to all non-GET routes
    consumer
      .apply(CsrfMiddleware)
      .exclude(
        { path: "api/auth/csrf-token", method: RequestMethod.GET },
        { path: "api/auth/login", method: RequestMethod.POST },
        { path: "api/auth/register", method: RequestMethod.POST },
      )
      .forRoutes("*");

    // Apply rate limiting to auth routes
    consumer
      .apply(AuthRateLimitMiddleware)
      .forRoutes(
        { path: "api/auth/login", method: RequestMethod.POST },
        { path: "api/auth/register", method: RequestMethod.POST },
      );

    // Apply rate limiting to OTP routes
    consumer
      .apply(OtpRateLimitMiddleware)
      .forRoutes(
        { path: "api/auth/send-otp", method: RequestMethod.POST },
        { path: "api/auth/verify-otp", method: RequestMethod.POST },
      );
  }
}
