import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the application
 * @param app NestJS application instance
 * @param apiPrefix API prefix for the routes
 */
export function setupSwagger(app: INestApplication, apiPrefix: string): void {
  try {
    const config = new DocumentBuilder()
      .setTitle("SEA-FAJ API")
      .setDescription(`
        # API Documentation for SEA-FAJ Student & Employer Platform

        This API provides endpoints for students, employers, administrators, and super administrators.

        ## Authentication
        Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
        \`\`\`
        Authorization: Bearer YOUR_TOKEN
        \`\`\`

        ## Role-Based Access
        Endpoints are organized by user role:
        - /student/* - For student users
        - /employer/* - For employer users
        - /admin/* - For administrators
        - /super-admin/* - For super administrators

        ## Error Handling
        The API returns appropriate HTTP status codes:
        - 200/201: Success
        - 400: Bad Request
        - 401: Unauthorized
        - 403: Forbidden
        - 404: Not Found
        - 500: Server Error

        ## Messaging Features
        - Students and employers can message admins for support
        - Admins can respond to messages from students and employers
        - Super admins can view all message logs

        ## Notification System
        - Super admins receive notifications when new users register
        - Users receive notifications for important events
      `)
      .setVersion("1.0")
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      })
      .addTag('Student', 'Endpoints for student users')
      .addTag('Employer', 'Endpoints for employer users')
      .addTag('Admin', 'Endpoints for administrators')
      .addTag('Super Admin', 'Endpoints for super administrators')
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Messages', 'Messaging endpoints')
      .addTag('Notifications', 'Notification endpoints')
      .addTag('Documents', 'Document management endpoints')
      .addTag('Applications', 'Application management endpoints')
      .addTag('Payments', 'Payment management endpoints')
      .build();

    console.log('Creating Swagger document...');
    const document = SwaggerModule.createDocument(app, config);
    console.log('Swagger document created successfully');

    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    console.log('Swagger setup completed');
  } catch (error) {
    console.error('Error setting up Swagger:', error);
  }
}
