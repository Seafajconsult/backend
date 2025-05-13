import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  environment: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  apiPrefix: process.env.API_PREFIX || "api",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET || "your-access-secret-key-min-32-chars",
    accessExpiration: parseInt(process.env.JWT_ACCESS_EXPIRATION || "900", 10), // 15 minutes
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-min-32-chars",
    refreshExpiration: parseInt(
      process.env.JWT_REFRESH_EXPIRATION || "604800",
      10,
    ), // 7 days
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
    from: process.env.SMTP_FROM || "noreply@sea-faj.com",
  },
  otp: {
    expiration: parseInt(process.env.OTP_EXPIRATION || "600", 10), // 10 minutes
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/sea-faj",
  },
}));
