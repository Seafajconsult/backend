import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { DocumentService } from "../document/document.service";
import { PaymentService } from "../payment/payment.service";
import { MessageService } from "../message/message.service";
import { NotificationService } from "../notification/notification.service";
import { ApplicationService } from "../application/application.service";
import { RegisterDto } from "../auth/dto/register.dto";
import { VerifyOtpDto } from "../auth/dto/verify-otp.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { CreateDocumentDto } from "../document/dto/create-document.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class StudentController {
    private readonly authService;
    private readonly userService;
    private readonly documentService;
    private readonly paymentService;
    private readonly messageService;
    private readonly notificationService;
    private readonly applicationService;
    constructor(authService: AuthService, userService: UserService, documentService: DocumentService, paymentService: PaymentService, messageService: MessageService, notificationService: NotificationService, applicationService: ApplicationService);
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
    uploadDocument(req: RequestWithUser, file: Express.Multer.File, createDocumentDto: CreateDocumentDto): Promise<import("mongoose").Document<unknown, {}, import("../document/document.schema").UserDocument, {}> & import("../document/document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMyDocuments(req: RequestWithUser): Promise<(import("mongoose").Document<unknown, {}, import("../document/document.schema").UserDocument, {}> & import("../document/document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
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
