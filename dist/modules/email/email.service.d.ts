import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
export declare class EmailService {
    private configService;
    private userService;
    private transporter;
    constructor(configService: ConfigService, userService: UserService);
    sendOTP(email: string, otp: string): Promise<void>;
    sendAdminInvitation(email: string, inviteToken: string): Promise<void>;
    sendNotificationEmail(userId: string, title: string, message: string): Promise<void>;
    sendApplicationStatusUpdate(userId: string, applicationId: string, status: string, details?: string): Promise<void>;
}
