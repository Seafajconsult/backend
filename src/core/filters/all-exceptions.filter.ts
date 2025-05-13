import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoggingService } from "../services/logging.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string | Record<string, any> =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === "string"
          ? message
          : (message as Record<string, any>)["message"] || "Internal server error",
      ...(typeof message === "object" && message),
    };

    // Log the error with stack trace if available
    this.loggingService.error(
      "Request Error",
      exception instanceof Error ? exception.stack : undefined,
      {
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
      },
    );

    response.status(status).json(errorResponse);
  }
}
