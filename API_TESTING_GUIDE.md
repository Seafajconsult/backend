# SEA-FAJ API Testing Guide

This guide provides detailed instructions for testing the SEA-FAJ API endpoints. It includes examples of requests and expected responses for each endpoint.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Authentication](#authentication)
- [Student Endpoints](#student-endpoints)
- [Employer Endpoints](#employer-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Super Admin Endpoints](#super-admin-endpoints)
- [Messaging System](#messaging-system)
- [Notification System](#notification-system)

## Prerequisites

Before testing the API, ensure you have:

1. The server running locally or access to the deployed API
2. Postman or another API testing tool
3. Access to the Swagger documentation at `/api/docs`

## Authentication

### Register a New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

Expected Response:
```json
{
  "userId": "123456789",
  "message": "Registration successful. Please verify your email with the OTP sent."
}
```

### Verify Email with OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "userId": "123456789",
  "otp": "123456"
}
```

Expected Response:
```json
{
  "message": "Email verified successfully."
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Expected Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "123456789",
    "email": "user@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Expected Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "message": "Logged out successfully"
}
```

### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Expected Response:
```json
{
  "message": "Password reset instructions sent to your email"
}
```

### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

Expected Response:
```json
{
  "message": "Password reset successfully"
}
```

## Student Endpoints

### Upload Document

```http
POST /api/student/documents/upload
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

form-data:
  title: "Resume"
  description: "My professional resume"
  file: [Select file]
```

Expected Response:
```json
{
  "id": "60a1b2c3d4e5f6g7h8i9j0k",
  "title": "Resume",
  "description": "My professional resume",
  "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/abcdef.pdf",
  "fileType": "application/pdf",
  "status": "PENDING",
  "createdAt": "2023-06-01T12:00:00.000Z"
}
```

### Get Student Documents

```http
GET /api/student/documents
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "id": "60a1b2c3d4e5f6g7h8i9j0k",
    "title": "Resume",
    "description": "My professional resume",
    "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/abcdef.pdf",
    "fileType": "application/pdf",
    "status": "PENDING",
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
]
```

### Message Admin

```http
POST /api/student/messages/admin
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "content": "Hello, I need help with my application."
}
```

Expected Response:
```json
{
  "conversation": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "participants": [
      {
        "userId": "123456789",
        "email": "user@example.com",
        "role": "STUDENT"
      },
      {
        "userId": "987654321",
        "email": "admin@sea-faj.com",
        "role": "ADMIN"
      }
    ],
    "type": "STUDENT_ADMIN",
    "isActive": true,
    "lastMessageAt": "2023-06-01T12:00:00.000Z"
  },
  "message": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "sender": "123456789",
    "conversation": "60a1b2c3d4e5f6g7h8i9j0k",
    "content": "Hello, I need help with my application.",
    "type": "TEXT",
    "status": "SENT",
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
}
```

### Get Admin Conversation

```http
GET /api/student/messages/admin
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "conversation": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "participants": [
      {
        "userId": "123456789",
        "email": "user@example.com",
        "role": "STUDENT"
      },
      {
        "userId": "987654321",
        "email": "admin@sea-faj.com",
        "role": "ADMIN"
      }
    ],
    "type": "STUDENT_ADMIN",
    "isActive": true,
    "lastMessageAt": "2023-06-01T12:00:00.000Z"
  },
  "messages": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0k",
      "sender": "123456789",
      "conversation": "60a1b2c3d4e5f6g7h8i9j0k",
      "content": "Hello, I need help with my application.",
      "type": "TEXT",
      "status": "SENT",
      "createdAt": "2023-06-01T12:00:00.000Z"
    }
  ]
}
```

### Get Admission Status

```http
GET /api/student/admission/status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "status": "APPROVED",
  "applicationId": "60a1b2c3d4e5f6g7h8i9j0k",
  "admissionDate": "2023-06-15T00:00:00.000Z",
  "program": "Computer Science",
  "comments": "Congratulations on your admission!",
  "updatedAt": "2023-06-01T12:00:00.000Z"
}
```

### Initiate Payment

```http
POST /api/student/payments/initiate
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "amount": 500,
  "currency": "USD",
  "paymentMethod": "CARD",
  "description": "Application fee"
}
```

Expected Response:
```json
{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "amount": 500,
  "currency": "USD",
  "status": "PENDING",
  "paymentMethod": "CARD",
  "redirectUrl": "https://payment-gateway.com/checkout/abc123",
  "reference": "PAY-123456789",
  "createdAt": "2023-06-01T12:00:00.000Z"
}
```

### Get Payment History

```http
GET /api/student/payments
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
    "amount": 500,
    "currency": "USD",
    "status": "COMPLETED",
    "paymentMethod": "CARD",
    "description": "Application fee",
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "paymentId": "60a1b2c3d4e5f6g7h8i9j0l",
    "amount": 1000,
    "currency": "USD",
    "status": "PENDING",
    "paymentMethod": "BANK_TRANSFER",
    "description": "Tuition fee",
    "createdAt": "2023-06-02T12:00:00.000Z"
  }
]
```

### Verify Payment

```http
POST /api/student/payments/verify
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "transactionReference": "TXN-123456789"
}
```

Expected Response:
```json
{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "status": "COMPLETED",
  "verificationDate": "2023-06-01T12:05:00.000Z",
  "message": "Payment verified successfully"
}
```

## Employer Endpoints

### Get Employer Applications

```http
GET /api/employer/applications
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "student": {
      "userId": "123456789",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "position": "Software Developer",
    "description": "Application for the software developer position",
    "status": "SUBMITTED",
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
]
```

### Message Admin (Employer)

```http
POST /api/employer/messages/admin
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "content": "Hello, I need help with posting a job."
}
```

Expected Response:
```json
{
  "conversation": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "participants": [
      {
        "userId": "123456789",
        "email": "employer@company.com",
        "role": "EMPLOYER"
      },
      {
        "userId": "987654321",
        "email": "admin@sea-faj.com",
        "role": "ADMIN"
      }
    ],
    "type": "EMPLOYER_ADMIN",
    "isActive": true,
    "lastMessageAt": "2023-06-01T12:00:00.000Z"
  },
  "message": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "sender": "123456789",
    "conversation": "60a1b2c3d4e5f6g7h8i9j0k",
    "content": "Hello, I need help with posting a job.",
    "type": "TEXT",
    "status": "SENT",
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
}
```

### Create Job Posting

```http
POST /api/employer/jobs
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Software Developer",
  "description": "We are looking for a skilled software developer...",
  "requirements": "5+ years of experience, JavaScript, Node.js",
  "location": "New York, NY",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "applicationDeadline": "2023-07-30T23:59:59.999Z"
}
```

Expected Response:
```json
{
  "jobId": "60a1b2c3d4e5f6g7h8i9j0k",
  "title": "Software Developer",
  "description": "We are looking for a skilled software developer...",
  "requirements": "5+ years of experience, JavaScript, Node.js",
  "location": "New York, NY",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "applicationDeadline": "2023-07-30T23:59:59.999Z",
  "status": "ACTIVE",
  "createdAt": "2023-06-01T12:00:00.000Z"
}
```

### Initiate Payment (Employer)

```http
POST /api/employer/payments/initiate
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "amount": 200,
  "currency": "USD",
  "paymentMethod": "CARD",
  "description": "Job posting fee"
}
```

Expected Response:
```json
{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "amount": 200,
  "currency": "USD",
  "status": "PENDING",
  "paymentMethod": "CARD",
  "redirectUrl": "https://payment-gateway.com/checkout/abc123",
  "reference": "PAY-123456789",
  "createdAt": "2023-06-01T12:00:00.000Z"
}
```

### Get Payment History (Employer)

```http
GET /api/employer/payments
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
    "amount": 200,
    "currency": "USD",
    "status": "COMPLETED",
    "paymentMethod": "CARD",
    "description": "Job posting fee",
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "paymentId": "60a1b2c3d4e5f6g7h8i9j0l",
    "amount": 500,
    "currency": "USD",
    "status": "PENDING",
    "paymentMethod": "BANK_TRANSFER",
    "description": "Premium listing fee",
    "createdAt": "2023-06-02T12:00:00.000Z"
  }
]
```

### Verify Payment (Employer)

```http
POST /api/employer/payments/verify
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "transactionReference": "TXN-123456789"
}
```

Expected Response:
```json
{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "status": "COMPLETED",
  "verificationDate": "2023-06-01T12:05:00.000Z",
  "message": "Payment verified successfully"
}
```

## Admin Endpoints

### Get All Users

```http
GET /api/admin/users
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "userId": "123456789",
    "email": "student@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "status": "ACTIVE",
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "userId": "987654321",
    "email": "employer@company.com",
    "role": "EMPLOYER",
    "firstName": "Jane",
    "lastName": "Smith",
    "isEmailVerified": true,
    "status": "ACTIVE",
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
]
```

### Get Student Conversations

```http
GET /api/admin/messages/student
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "participants": [
      {
        "userId": "123456789",
        "email": "student@example.com",
        "role": "STUDENT"
      },
      {
        "userId": "987654321",
        "email": "admin@sea-faj.com",
        "role": "ADMIN"
      }
    ],
    "type": "STUDENT_ADMIN",
    "isActive": true,
    "lastMessageAt": "2023-06-01T12:00:00.000Z"
  }
]
```

### Reply to Conversation

```http
POST /api/admin/messages/reply/60a1b2c3d4e5f6g7h8i9j0k
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "content": "How can I help you with your application?"
}
```

Expected Response:
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0l",
  "sender": "987654321",
  "conversation": "60a1b2c3d4e5f6g7h8i9j0k",
  "content": "How can I help you with your application?",
  "type": "TEXT",
  "status": "SENT",
  "createdAt": "2023-06-01T12:05:00.000Z"
}
```

### Get All Admission Applications

```http
GET /api/admin/admission/applications
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "student": {
      "userId": "123456789",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "program": "Computer Science",
    "status": "PENDING",
    "documents": [
      {
        "_id": "60a1b2c3d4e5f6g7h8i9j0m",
        "title": "Transcript",
        "status": "APPROVED"
      },
      {
        "_id": "60a1b2c3d4e5f6g7h8i9j0n",
        "title": "Recommendation Letter",
        "status": "PENDING"
      }
    ],
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
]
```

### Update Admission Status

```http
PUT /api/admin/admission/applications/60a1b2c3d4e5f6g7h8i9j0k/status
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "APPROVED",
  "comments": "Congratulations on your admission!",
  "admissionDate": "2023-06-15T00:00:00.000Z"
}
```

Expected Response:
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "student": {
    "userId": "123456789",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "program": "Computer Science",
  "status": "APPROVED",
  "comments": "Congratulations on your admission!",
  "admissionDate": "2023-06-15T00:00:00.000Z",
  "updatedAt": "2023-06-01T12:05:00.000Z"
}
```

### Process Payment Refund

```http
POST /api/admin/payments/60a1b2c3d4e5f6g7h8i9j0k/refund
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reason": "Student withdrew application",
  "amount": 500
}
```

Expected Response:
```json
{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0k",
  "status": "REFUNDED",
  "refundAmount": 500,
  "refundReason": "Student withdrew application",
  "refundDate": "2023-06-01T12:05:00.000Z",
  "message": "Refund processed successfully"
}
```

## Super Admin Endpoints

### Get System Statistics

```http
GET /api/super-admin/system/stats
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "totalUsers": 150,
  "usersByRole": {
    "students": 100,
    "employers": 45,
    "admins": 5
  }
}
```

### Get All Conversations

```http
GET /api/super-admin/messages/all
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "participants": [
      {
        "userId": "123456789",
        "email": "student@example.com",
        "role": "STUDENT"
      },
      {
        "userId": "987654321",
        "email": "admin@sea-faj.com",
        "role": "ADMIN"
      }
    ],
    "type": "STUDENT_ADMIN",
    "isActive": true,
    "lastMessageAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0m",
    "participants": [
      {
        "userId": "123456780",
        "email": "employer@company.com",
        "role": "EMPLOYER"
      },
      {
        "userId": "987654321",
        "email": "admin@sea-faj.com",
        "role": "ADMIN"
      }
    ],
    "type": "EMPLOYER_ADMIN",
    "isActive": true,
    "lastMessageAt": "2023-06-01T12:10:00.000Z"
  }
]
```

### Get Notifications

```http
GET /api/super-admin/notifications
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0n",
    "userId": "111222333",
    "title": "New User Registration",
    "message": "A new user (student@example.com) has registered as a student.",
    "type": "SYSTEM",
    "isRead": false,
    "data": {
      "userId": "123456789",
      "email": "student@example.com",
      "role": "STUDENT"
    },
    "link": "/admin/users/123456789",
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
]
```

### Get Payment Statistics

```http
GET /api/super-admin/payments/stats
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "totalPayments": 150,
  "totalAmount": 75000,
  "paymentsByStatus": {
    "COMPLETED": 120,
    "PENDING": 20,
    "FAILED": 5,
    "REFUNDED": 5
  },
  "paymentsByMethod": {
    "CARD": 100,
    "BANK_TRANSFER": 40,
    "MOBILE_MONEY": 10
  },
  "revenueByMonth": [
    {
      "month": "January",
      "amount": 10000
    },
    {
      "month": "February",
      "amount": 12000
    },
    {
      "month": "March",
      "amount": 15000
    }
  ]
}
```

### Get Admission Statistics

```http
GET /api/super-admin/admission/stats
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "totalApplications": 200,
  "applicationsByStatus": {
    "PENDING": 50,
    "UNDER_REVIEW": 30,
    "APPROVED": 100,
    "REJECTED": 20
  },
  "applicationsByProgram": {
    "Computer Science": 80,
    "Business Administration": 60,
    "Engineering": 40,
    "Medicine": 20
  },
  "applicationsByMonth": [
    {
      "month": "January",
      "count": 50
    },
    {
      "month": "February",
      "count": 70
    },
    {
      "month": "March",
      "count": 80
    }
  ]
}
```

## Messaging System

### Create a New Conversation

```http
POST /api/messages/conversations
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "participants": ["123456789", "987654321"],
  "type": "STUDENT_EMPLOYER"
}
```

Expected Response:
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0o",
  "participants": [
    {
      "userId": "123456789",
      "email": "student@example.com",
      "role": "STUDENT"
    },
    {
      "userId": "987654321",
      "email": "employer@company.com",
      "role": "EMPLOYER"
    }
  ],
  "type": "STUDENT_EMPLOYER",
  "isActive": true,
  "lastMessageAt": "2023-06-01T12:15:00.000Z",
  "createdAt": "2023-06-01T12:15:00.000Z"
}
```

### Send a Message

```http
POST /api/messages
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "conversationId": "60a1b2c3d4e5f6g7h8i9j0o",
  "content": "Hello, I'm interested in your job posting."
}
```

Expected Response:
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0p",
  "sender": "123456789",
  "conversation": "60a1b2c3d4e5f6g7h8i9j0o",
  "content": "Hello, I'm interested in your job posting.",
  "type": "TEXT",
  "status": "SENT",
  "createdAt": "2023-06-01T12:20:00.000Z"
}
```

## Notification System

### Get User Notifications

```http
GET /api/notifications
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0q",
    "userId": "123456789",
    "title": "Application Status Update",
    "message": "Your application has been reviewed.",
    "type": "APPLICATION",
    "isRead": false,
    "data": {
      "applicationId": "60a1b2c3d4e5f6g7h8i9j0r",
      "status": "UNDER_REVIEW"
    },
    "link": "/applications/60a1b2c3d4e5f6g7h8i9j0r",
    "createdAt": "2023-06-01T12:25:00.000Z"
  }
]
```

### Mark Notification as Read

```http
POST /api/notifications/60a1b2c3d4e5f6g7h8i9j0q/read
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected Response:
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0q",
  "userId": "123456789",
  "title": "Application Status Update",
  "message": "Your application has been reviewed.",
  "type": "APPLICATION",
  "isRead": true,
  "data": {
    "applicationId": "60a1b2c3d4e5f6g7h8i9j0r",
    "status": "UNDER_REVIEW"
  },
  "link": "/applications/60a1b2c3d4e5f6g7h8i9j0r",
  "createdAt": "2023-06-01T12:25:00.000Z",
  "updatedAt": "2023-06-01T12:30:00.000Z"
}
```
