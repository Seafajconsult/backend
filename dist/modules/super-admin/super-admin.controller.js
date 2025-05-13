"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../user/user.schema");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
const message_service_1 = require("../message/message.service");
const notification_service_1 = require("../notification/notification.service");
const login_dto_1 = require("../auth/dto/login.dto");
const conversation_schema_1 = require("../message/conversation.schema");
let SuperAdminController = class SuperAdminController {
    constructor(authService, userService, messageService, notificationService) {
        this.authService = authService;
        this.userService = userService;
        this.messageService = messageService;
        this.notificationService = notificationService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async inviteAdmin(email) {
        return this.authService.inviteAdmin(email);
    }
    async getAllAdmins() {
        return this.userService.findAll(user_schema_1.UserRole.ADMIN);
    }
    async getAdminById(id) {
        return this.userService.findById(id);
    }
    async deleteAdmin(id) {
        return this.userService.delete(id);
    }
    async getSystemStats() {
        return {
            totalUsers: await this.userService.count(),
            usersByRole: {
                students: await this.userService.countByRole(user_schema_1.UserRole.STUDENT),
                employers: await this.userService.countByRole(user_schema_1.UserRole.EMPLOYER),
                admins: await this.userService.countByRole(user_schema_1.UserRole.ADMIN),
            }
        };
    }
    async getAllConversations() {
        return this.messageService.findAllConversations();
    }
    async getStudentAdminConversations() {
        return this.messageService.findConversationsByType(conversation_schema_1.ConversationType.STUDENT_ADMIN);
    }
    async getEmployerAdminConversations() {
        return this.messageService.findConversationsByType(conversation_schema_1.ConversationType.EMPLOYER_ADMIN);
    }
    async getConversation(id) {
        const conversation = await this.messageService.findConversation(id);
        const messages = await this.messageService.findConversationMessages(id, 100, 0);
        return {
            conversation,
            messages
        };
    }
    async getNotifications(req) {
        return this.notificationService.getUserNotifications(req.user.userId);
    }
    async getUnreadCount(req) {
        return {
            count: await this.notificationService.getUnreadCount(req.user.userId)
        };
    }
    async markNotificationAsRead(id) {
        return this.notificationService.markAsRead(id);
    }
    async markAllNotificationsAsRead(req) {
        return this.notificationService.markAllAsRead(req.user.userId);
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Super Admin login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('admins/invite'),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a new admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin invitation sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email' }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "inviteAdmin", null);
__decorate([
    (0, common_1.Get)('admins'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admins' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all admins' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Get)('admins/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the admin' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admin not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Admin ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getAdminById", null);
__decorate([
    (0, common_1.Delete)('admins/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admin not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Admin ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "deleteAdmin", null);
__decorate([
    (0, common_1.Get)('system/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns system statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getSystemStats", null);
__decorate([
    (0, common_1.Get)('messages/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all conversations in the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all conversations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getAllConversations", null);
__decorate([
    (0, common_1.Get)('messages/student-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all student-admin conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all student-admin conversations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getStudentAdminConversations", null);
__decorate([
    (0, common_1.Get)('messages/employer-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employer-admin conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all employer-admin conversations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getEmployerAdminConversations", null);
__decorate([
    (0, common_1.Get)('messages/conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the conversation with messages' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications for super admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all notifications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/unread/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of unread notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns count of unread notifications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('notifications/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.Post)('notifications/read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as read' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "markAllNotificationsAsRead", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin'),
    (0, common_1.Controller)('super-admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        message_service_1.MessageService,
        notification_service_1.NotificationService])
], SuperAdminController);
//# sourceMappingURL=super-admin.controller.js.map