"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app, apiPrefix) {
    try {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("SEA-FAJ API")
            .setDescription(`
        # API Documentation for SEA-FAJ Student & Employer Platform

        This API provides endpoints for students, employers, administrators, and super administrators.

        ## Request/Response Examples

        ### Register Student
        \`\`\`json
        POST /student/auth/register
        {
          "email": "student@example.com",
          "password": "StrongPass123!",
          "firstName": "John",
          "lastName": "Doe"
        }
        \`\`\`

        ### Upload Document
        \`\`\`
        POST /student/documents/upload
        Content-Type: multipart/form-data

        file: <file>
        documentType: "PASSPORT"
        \`\`\`

        ### Create Application
        \`\`\`json
        POST /student/applications
        {
          "employerId": "60d21b4667d0d8992e610c85",
          "position": "Software Engineer Intern"
        }
        \`\`\`

        ### Document Types
        - PASSPORT
        - TRANSCRIPT
        - TEST_SCORE
        - OFFER_LETTER
        - OTHER

        ### Application Statuses
        - DRAFT
        - SUBMITTED
        - DOCUMENT_REVIEW
        - INTERVIEW_SCHEDULED
        - INTERVIEW_COMPLETED
        - OFFER_PENDING
        - OFFER_ACCEPTED
        - OFFER_REJECTED
        - COMPLETED
        - CANCELLED

        ### Payment Types
        - APPLICATION_FEE
        - SERVICE_CHARGE
        - CONSULTATION_FEE

        #        ## Message Types
        - STUDENT_ADVISOR
        - STUDENT_EMPLOYER
        - STUDENT_ADMIN
        - EMPLOYER_ADMIN
        - SUPPORT

        ## Sample API Calls

        ### Create Application
        \`\`\`json
        POST /applications
        {
          "employerId": "60d21b4667d0d8992e610c85",
          "position": "Software Engineer Intern"
        }

        Response 201:
        {
          "applicationId": "60d21b4667d0d8992e610c86",
          "status": "DRAFT",
          "createdAt": "2025-05-19T10:00:00Z"
        }
        \`\`\`

        ### Update Application Status
        \`\`\`json
        PUT /applications/{id}
        {
          "status": "INTERVIEW_SCHEDULED",
          "interviewDate": "2025-06-01T14:00:00Z",
          "interviewNotes": "Technical interview with senior engineer"
        }

        Response 200:
        {
          "applicationId": "60d21b4667d0d8992e610c86",
          "status": "INTERVIEW_SCHEDULED",
          "statusHistory": [
            "2025-05-19T10:00:00Z - Application created",
            "2025-05-19T11:00:00Z - Interview scheduled"
          ]
        }
        \`\`\`

        ### Create Payment
        \`\`\`json
        POST /payments
        {
          "amount": 5000,
          "paymentType": "APPLICATION_FEE",
          "currency": "NGN",
          "description": "Application processing fee",
          "applicationId": "60d21b4667d0d8992e610c86"
        }

        Response 201:
        {
          "paymentId": "60d21b4667d0d8992e610c87",
          "status": "PENDING",
          "transactionId": "txn_1234567890"
        }
        \`\`\`

        ### Send Message
        \`\`\`json
        POST /messages
        {
          "conversationId": "60d21b4667d0d8992e610c88",
          "content": "Hello, I need help with my application",
          "type": "TEXT"
        }

        Response 201:
        {
          "messageId": "60d21b4667d0d8992e610c89",
          "status": "SENT",
          "createdAt": "2025-05-19T12:00:00Z"
        }
        \`\`\`

        ### Create Notification
        \`\`\`json
        POST /notifications
        {
          "userId": "60d21b4667d0d8992e610c85",
          "title": "Document Approved",
          "message": "Your passport has been verified and approved",
          "type": "DOCUMENT_STATUS",
          "data": {
            "documentId": "60d21b4667d0d8992e610c90"
          }
        }

        Response 201:
        {
          "notificationId": "60d21b4667d0d8992e610c91",
          "createdAt": "2025-05-19T13:00:00Z"
        }
        \`\`\`

        ## Authentication
        Most endpoints require authentication using JWT tokens. 
        
        ### Authentication Flow
        1. Register user account (/auth/register)
        2. Verify email with OTP (/auth/verify-otp)
        3. Login to get tokens (/auth/login)
        4. Use access token for requests
        5. Refresh token when expired (/auth/refresh)

        ### Headers Required
        Include the token in the Authorization header:
        \`\`\`
        Authorization: Bearer YOUR_TOKEN
        \`\`\`

        ### Token Response Format
        \`\`\`json
        {
          "access_token": "eyJhbGciOiJIUzI1NiIs...",
          "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
          "expires_in": 3600,
          "user": {
            "userId": "123456789",
            "email": "user@example.com",
            "role": "STUDENT",
            "isEmailVerified": true
          }
        }
        \`\`\`

        ### Token Expiration
        - Access Token: 1 hour
        - Refresh Token: 7 days
        
        ### OTP Verification
        - 6-digit code sent via email
        - Valid for 10 minutes
        - Maximum 3 retry attempts

        ## File Uploads
        Document uploads are handled using multipart/form-data:
        
        ### Supported File Types
        - Images: jpg, jpeg, png (max 5MB)
        - Documents: pdf (max 10MB)
        - Transcripts: pdf (max 10MB)
        
        ### File Upload Response
        \`\`\`json
        {
          "documentId": "60d21b4667d0d8992e610c85",
          "originalName": "passport.pdf",
          "documentType": "PASSPORT",
          "status": "PENDING",
          "cloudinaryUrl": "https://res.cloudinary.com/..."
        }
        \`\`\`

        ## Rate Limiting
        API endpoints are rate-limited to prevent abuse:
        - Authentication: 5 requests per minute
        - File uploads: 10 uploads per hour
        - General endpoints: 60 requests per minute
        
        Rate limit response (HTTP 429):
        \`\`\`json
        {
          "statusCode": 429,
          "message": "Too Many Requests",
          "retryAfter": 60
        }
        \`\`\`

        ## WebSocket Connections
        Real-time features are implemented using WebSocket connections.

        ### Connection
        \`\`\`javascript
        const socket = io('ws://api.example.com', {
          auth: {
            token: 'YOUR_JWT_TOKEN'
          }
        });
        \`\`\`

        ### Events
        1. Chat Messages:
        \`\`\`javascript
        // Send message
        socket.emit('sendMessage', {
          conversationId: '60d21b4667d0d8992e610c88',
          content: 'Hello!',
          type: 'TEXT'
        });

        // Receive message
        socket.on('newMessage', (message) => {
          console.log('New message:', message);
        });
        \`\`\`

        2. Notifications:
        \`\`\`javascript
        socket.on('notification', (notification) => {
          console.log('New notification:', notification);
        });
        \`\`\`

        3. Application Updates:
        \`\`\`javascript
        socket.on('applicationUpdate', (update) => {
          console.log('Application update:', update);
        });
        \`\`\`

        ### Connection Status
        \`\`\`javascript
        socket.on('connect', () => {
          console.log('Connected to WebSocket');
        });

        socket.on('disconnect', (reason) => {
          console.log('Disconnected:', reason);
        });
        \`\`\`

        ## Role-Based Access
        Endpoints are organized by user role:
        - /student/* - For student users
        - /employer/* - For employer users
        - /admin/* - For administrators
        - /super-admin/* - For super administrators

        ## Error Handling
        The API returns appropriate HTTP status codes with detailed error messages:

        ### Success Responses
        - 200: OK - Request successful
        - 201: Created - Resource created successfully
        - 204: No Content - Request successful, no content to return

        ### Client Errors
        - 400: Bad Request
          - Invalid input data
          - Validation errors
          - Missing required fields
        - 401: Unauthorized
          - Invalid or expired token
          - Invalid credentials
        - 403: Forbidden
          - Insufficient permissions
          - Role-based access denied
        - 404: Not Found
          - Resource not found
          - Invalid ID or reference
        - 409: Conflict
          - Email already exists
          - Duplicate entry
        
        ### Server Errors
        - 500: Internal Server Error
          - Unexpected server error
          - Database connection issues
        - 503: Service Unavailable
          - System maintenance
          - Third-party service unavailable

        ### Error Response Format
        \`\`\`json
        {
          "statusCode": 400,
          "message": "Validation failed",
          "errors": [
            {
              "field": "email",
              "message": "Invalid email format"
            }
          ]
        }
        \`\`\`

        ## Pagination and Filtering
        List endpoints support pagination and filtering:

        ### Pagination Parameters
        \`\`\`
        GET /applications?page=1&limit=10
        GET /documents?skip=0&take=20
        \`\`\`

        Response format:
        \`\`\`json
        {
          "data": [...],
          "meta": {
            "page": 1,
            "limit": 10,
            "total": 100,
            "totalPages": 10
          }
        }
        \`\`\`

        ### Filtering and Sorting
        \`\`\`
        GET /applications?status=PENDING&sort=createdAt:desc
        GET /documents?type=PASSPORT&status=PENDING
        GET /users?role=STUDENT&isVerified=true
        \`\`\`

        ### Search
        \`\`\`
        GET /applications?search=software engineer
        GET /documents?search=passport
        \`\`\`

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
            .addTag('Student', 'Student management - registration, profile, documents, applications')
            .addTag('Employer', 'Employer management - registration, profile, job postings, applications')
            .addTag('Admin', 'Administrative functions - user management, document verification, application processing')
            .addTag('Super Admin', 'System administration - admin management, analytics, system settings')
            .addTag('Auth', 'Authentication - login, registration, email verification, token refresh')
            .addTag('Messages', 'Messaging system - conversations, chat, notifications between users')
            .addTag('Notifications', 'System notifications - status updates, reminders, alerts')
            .addTag('Documents', 'Document management - upload, verification, status tracking')
            .addTag('Applications', 'Application processing - submission, tracking, updates, interviews')
            .addTag('Payments', 'Payment processing - fees, transactions, invoices')
            .build();
        console.log('Creating Swagger document...');
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        console.log('Swagger document created successfully');
        swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
        console.log('Swagger setup completed');
    }
    catch (error) {
        console.error('Error setting up Swagger:', error);
    }
}
//# sourceMappingURL=index.js.map