import { UserRole } from "../user/user.schema";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { DocumentService } from "../document/document.service";
import { PaymentService } from "../payment/payment.service";
import { MessageService } from "../message/message.service";
import { ApplicationService } from "../application/application.service";
import { LoginDto } from "../auth/dto/login.dto";
import { UpdateDocumentStatusDto } from "../document/dto/update-document-status.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class AdminController {
    private readonly authService;
    private readonly userService;
    private readonly documentService;
    private readonly paymentService;
    private readonly messageService;
    private readonly applicationService;
    constructor(authService: AuthService, userService: UserService, documentService: DocumentService, paymentService: PaymentService, messageService: MessageService, applicationService: ApplicationService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getAllUsers(role?: UserRole): Promise<import("../user/user.schema").User[]>;
    getUserById(id: string): Promise<import("../user/user.schema").User>;
    getAllDocuments(): Promise<(import("mongoose").Document<unknown, {}, import("../document/document.schema").UserDocument, {}> & import("../document/document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getDocumentById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../document/document.schema").UserDocument, {}> & import("../document/document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateDocumentStatus(id: string, updateStatusDto: UpdateDocumentStatusDto): Promise<import("mongoose").Document<unknown, {}, import("../document/document.schema").UserDocument, {}> & import("../document/document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllApplications(): Promise<import("../application/application.schema").Application[]>;
    getApplicationById(id: string): Promise<import("../application/application.schema").Application>;
    getAllPayments(): Promise<(import("mongoose").Document<unknown, {}, import("../payment/payment.schema").Payment, {}> & import("../payment/payment.schema").Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getPaymentById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../payment/payment.schema").Payment, {}> & import("../payment/payment.schema").Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getStudentConversations(req: RequestWithUser): Promise<import("../message/conversation.schema").Conversation[]>;
    getEmployerConversations(req: RequestWithUser): Promise<import("../message/conversation.schema").Conversation[]>;
    getConversation(id: string): Promise<{
        conversation: import("../message/conversation.schema").Conversation;
        messages: import("../message/message.schema").Message[];
    }>;
    replyToConversation(conversationId: string, content: string, req: RequestWithUser): Promise<import("../message/message.schema").Message>;
}
