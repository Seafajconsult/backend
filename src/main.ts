import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
// Temporarily disable mongoSanitize due to compatibility issues
// import * as mongoSanitize from "express-mongo-sanitize";
// xss-clean is not compatible with newer Node.js versions, so we'll skip it for now
import { rateLimit } from "express-rate-limit";
import { AppModule } from "./app.module";
import { setupSwagger } from "./swagger";

async function bootstrap() {
  // Log environment variables to verify they're loaded
  console.log('PORT from process.env:', process.env.PORT);

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Log environment variables from ConfigService to verify they're loaded
  console.log('PORT from ConfigService:', configService.get('app.port'));

  // Security middleware
  app.use(helmet());
  // Temporarily disable mongoSanitize due to compatibility issues
  // app.use(mongoSanitize());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: configService.get("app.frontendUrl"),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  const apiPrefix = configService.get("app.apiPrefix");
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  try {
    // Use the enhanced Swagger setup
    setupSwagger(app, apiPrefix);
  } catch (error) {
    console.error('Error setting up Swagger:', error);
  }

  // Start server
  // Use the port from environment variables or default to 5001
  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
}

bootstrap();
