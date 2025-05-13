import { UserRole } from "../user/user.schema";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { MessageService } from "../message/message.service";
import { ApplicationService } from "../application/application.service";
import { RegisterDto } from "../auth/dto/register.dto";
import { VerifyOtpDto } from "../auth/dto/verify-otp.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class EmployerController {
    private readonly authService;
    private readonly userService;
    private readonly messageService;
    private readonly applicationService;
    constructor(authService: AuthService, userService: UserService, messageService: MessageService, applicationService: ApplicationService);
    register(registerDto: RegisterDto): Promise<{
        userId: string;
        message: string;
    }>;
    verifyEmail(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getEmployerApplications(req: RequestWithUser): Promise<import("../application/application.schema").Application[]>;
    getApplicationById(id: string, req: RequestWithUser): Promise<import("../application/application.schema").Application>;
    getStatus(req: RequestWithUser): Promise<{
        status: string;
        userId: string;
        role: UserRole;
    }>;
    messageAdmin(req: RequestWithUser, content: string): Promise<{
        conversation: any;
        message: import("../message/message.schema").Message;
    }>;
    getAdminMessages(req: RequestWithUser): Promise<{
        conversations: any[];
        messages: any[];
        conversation?: undefined;
    } | {
        conversation: import("../message/conversation.schema").Conversation;
        messages: import("../message/message.schema").Message[];
        conversations?: undefined;
    }>;
}
