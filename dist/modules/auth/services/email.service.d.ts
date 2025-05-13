import { ConfigService } from "@nestjs/config";
interface IEmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export declare class EmailService {
    private readonly configService;
    private readonly transporter;
    constructor(configService: ConfigService);
    sendEmail(options: IEmailOptions): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendPasswordResetEmail(email: string, otp: string): Promise<void>;
    sendAdminInvitation(email: string, inviteLink: string): Promise<void>;
}
export {};
