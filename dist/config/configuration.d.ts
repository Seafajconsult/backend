declare const _default: () => {
    app: {
        port: number;
        apiPrefix: string;
        frontendUrl: string;
        env: string;
        jwt: {
            secret: string;
            refreshSecret: string;
            expiration: string;
            refreshExpiration: string;
            invitationSecret: string;
        };
        referral: {
            bonusAmount: number;
            maxReferrals: number;
            bonusEnabled: boolean;
        };
    };
    database: {
        uri: string;
    };
    email: {
        from: string;
        smtp: {
            user: string;
            password: string;
        };
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    otp: {
        expiryMinutes: number;
    };
    admin: {
        inviteExpiryHours: number;
    };
    payment: {
        paystackSecretKey: string;
        flutterwaveSecretKey: string;
    };
    logging: {
        level: string;
    };
    security: {
        csrfCookieKey: string;
    };
};
export default _default;
