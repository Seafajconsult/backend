declare const _default: (() => {
    environment: string;
    port: number;
    apiPrefix: string;
    frontendUrl: string;
    jwt: {
        accessSecret: string;
        accessExpiration: number;
        refreshSecret: string;
        refreshExpiration: number;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
    otp: {
        expiration: number;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    database: {
        uri: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    environment: string;
    port: number;
    apiPrefix: string;
    frontendUrl: string;
    jwt: {
        accessSecret: string;
        accessExpiration: number;
        refreshSecret: string;
        refreshExpiration: number;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
    otp: {
        expiration: number;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    database: {
        uri: string;
    };
}>;
export default _default;
