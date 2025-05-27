"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app: {
        port: parseInt(process.env.PORT, 10) || 8080,
        apiPrefix: process.env.API_PREFIX || 'api',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        env: process.env.NODE_ENV || 'development',
        jwt: {
            secret: process.env.JWT_SECRET,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            expiration: process.env.JWT_EXPIRATION || '15m',
            refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
            invitationSecret: process.env.JWT_SECRET,
        },
        referral: {
            bonusAmount: parseInt(process.env.REFERRAL_BONUS_AMOUNT, 10) || 50,
            maxReferrals: parseInt(process.env.MAX_REFERRALS_PER_USER, 10) || 10,
            bonusEnabled: process.env.REFERRAL_BONUS_ENABLED === 'true',
        },
    },
    database: {
        uri: process.env.DATABASE_URI,
    },
    email: {
        from: process.env.EMAIL_FROM || 'noreply@sea-faj.com',
        smtp: {
            user: process.env.BREVO_SMTP_USER,
            password: process.env.BREVO_SMTP_PASSWORD,
        },
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },
    otp: {
        expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10,
    },
    admin: {
        inviteExpiryHours: parseInt(process.env.ADMIN_INVITE_EXPIRY_HOURS, 10) || 24,
    },
    payment: {
        paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
        flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
    security: {
        csrfCookieKey: process.env.CSRF_COOKIE_KEY || 'xsrf-token',
    },
});
//# sourceMappingURL=configuration.js.map