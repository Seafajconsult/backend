import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { MessageService } from "../message/message.service";
import { NotificationService } from "../notification/notification.service";
import { LoginDto } from "../auth/dto/login.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class SuperAdminController {
    private readonly authService;
    private readonly userService;
    private readonly messageService;
    private readonly notificationService;
    constructor(authService: AuthService, userService: UserService, messageService: MessageService, notificationService: NotificationService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    inviteAdmin(email: string): Promise<{
        message: string;
    }>;
    getAllAdmins(): Promise<import("../user/user.schema").User[]>;
    getAdminById(id: string): Promise<import("../user/user.schema").User>;
    deleteAdmin(id: string): Promise<import("../user/user.schema").User>;
    getSystemStats(): Promise<{
        totalUsers: number;
        usersByRole: {
            students: number;
            employers: number;
            admins: number;
        };
    }>;
    getAllConversations(): Promise<import("../message/conversation.schema").Conversation[]>;
    getStudentAdminConversations(): Promise<import("../message/conversation.schema").Conversation[]>;
    getEmployerAdminConversations(): Promise<import("../message/conversation.schema").Conversation[]>;
    getConversation(id: string): Promise<{
        conversation: import("../message/conversation.schema").Conversation;
        messages: import("../message/message.schema").Message[];
    }>;
    getNotifications(req: RequestWithUser): Promise<{
        notifications: (import("mongoose").Document<unknown, {}, import("../notification/notification.schema").Notification, {}> & import("../notification/notification.schema").Notification & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getUnreadCount(req: RequestWithUser): Promise<{
        count: number;
    }>;
    markNotificationAsRead(id: string): Promise<import("mongoose").Document<unknown, {}, import("../notification/notification.schema").Notification, {}> & import("../notification/notification.schema").Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markAllNotificationsAsRead(req: RequestWithUser): Promise<import("mongoose").UpdateWriteOpResult>;
}
