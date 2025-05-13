# SEA-FAJ Consulting Backend

A comprehensive backend system for the SEA-FAJ Consulting platform, providing APIs for students, employers, administrators, and super administrators.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Role-Based Access](#role-based-access)
- [Authentication](#authentication)
- [Modules](#modules)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

SEA-FAJ Consulting Backend is a NestJS application that provides a robust API for managing student applications, employer interactions, document verification, payments, and administrative functions. The system is designed with a role-based access control system to ensure secure and appropriate access to resources.

## Features

- **Role-Based Access Control**: Different endpoints for students, employers, admins, and super admins
- **Authentication**: JWT-based authentication with refresh tokens
- **Document Management**: Upload, verify, and manage documents
- **Application Processing**: Submit and track applications
- **Payment Integration**: Process and track payments
- **Messaging System**: Communication between users and administrators
- **Notification System**: Real-time notifications for important events
- **Admin Dashboard**: Comprehensive admin tools for user management
- **Super Admin Controls**: System-wide management and monitoring

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **API Documentation**: Swagger
- **Real-time Communication**: Socket.io
- **Email Service**: Nodemailer
- **Validation**: Class Validator
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for document storage)
- SMTP server access (for email notifications)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sea-faj-backend.git
   cd sea-faj-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm run start:dev
   ```

5. Seed the database with initial data (optional):
   ```bash
   npm run seed:super-admin
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Application
PORT=5001
API_PREFIX=api
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sea-faj

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
EMAIL_FROM=noreply@sea-faj.com
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running. It provides detailed information about all endpoints, request/response formats, and authentication requirements.

### Swagger UI

The Swagger UI provides an interactive interface to explore and test the API endpoints. It includes:

- Endpoint descriptions
- Request parameters
- Response schemas
- Authentication requirements
- Example requests and responses

## Role-Based Access

The API is organized into role-based endpoints:

- `/api/student/*` - For student users
- `/api/employer/*` - For employer users
- `/api/admin/*` - For administrators
- `/api/super-admin/*` - For super administrators

Each role has specific permissions and access to different resources.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Obtain a token by logging in via `/api/auth/login` or the role-specific login endpoints
2. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer YOUR_TOKEN
   ```

Tokens expire after 15 minutes. Use the refresh token endpoint (`/api/auth/refresh`) to obtain a new access token.

## Modules

The backend is organized into the following modules:

- **Auth**: Authentication and authorization
- **User**: User management
- **Document**: Document upload and verification
- **Application**: Application submission and processing
- **Payment**: Payment processing and tracking
- **Message**: Communication between users
- **Notification**: System notifications
- **Admin**: Administrative functions
- **Super Admin**: System-wide management

## Testing

Run the test suite with:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
