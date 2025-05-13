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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../user/user.schema");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
const document_service_1 = require("../document/document.service");
const payment_service_1 = require("../payment/payment.service");
const message_service_1 = require("../message/message.service");
const application_service_1 = require("../application/application.service");
const login_dto_1 = require("../auth/dto/login.dto");
const update_document_status_dto_1 = require("../document/dto/update-document-status.dto");
const conversation_schema_1 = require("../message/conversation.schema");
let AdminController = class AdminController {
    constructor(authService, userService, documentService, paymentService, messageService, applicationService) {
        this.authService = authService;
        this.userService = userService;
        this.documentService = documentService;
        this.paymentService = paymentService;
        this.messageService = messageService;
        this.applicationService = applicationService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async getAllUsers(role) {
        return this.userService.findAll(role);
    }
    async getUserById(id) {
        return this.userService.findById(id);
    }
    async getAllDocuments() {
        return this.documentService.findAll();
    }
    async getDocumentById(id) {
        return this.documentService.findDocumentById(id);
    }
    async updateDocumentStatus(id, updateStatusDto) {
        return this.documentService.updateDocumentStatus(id, updateStatusDto.status, updateStatusDto.rejectionReason);
    }
    async getAllApplications() {
        return this.applicationService.findAll();
    }
    async getApplicationById(id) {
        return this.applicationService.findOne(id);
    }
    async getAllPayments() {
        return this.paymentService.findAll();
    }
    async getPaymentById(id) {
        return this.paymentService.findById(id);
    }
    async getStudentConversations(req) {
        return this.messageService.findUserConversationsByType(req.user.userId, conversation_schema_1.ConversationType.STUDENT_ADMIN);
    }
    async getEmployerConversations(req) {
        return this.messageService.findUserConversationsByType(req.user.userId, conversation_schema_1.ConversationType.EMPLOYER_ADMIN);
    }
    async getConversation(id) {
        const conversation = await this.messageService.findConversation(id);
        const messages = await this.messageService.findConversationMessages(id, 50, 0);
        return {
            conversation,
            messages
        };
    }
    async replyToConversation(conversationId, content, req) {
        await this.messageService.findConversation(conversationId);
        const message = await this.messageService.createMessage(req.user.userId, {
            conversationId,
            content
        });
        return message;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Admin login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all users' }),
    (0, swagger_1.ApiQuery)({ name: 'role', enum: user_schema_1.UserRole, required: false }),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the user' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all documents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all documents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllDocuments", null);
__decorate([
    (0, common_1.Get)('documents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get document by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the document' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Document ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDocumentById", null);
__decorate([
    (0, common_1.Post)('documents/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update document status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Document ID' }),
    (0, swagger_1.ApiBody)({ type: update_document_status_dto_1.UpdateDocumentStatusDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_document_status_dto_1.UpdateDocumentStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDocumentStatus", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all applications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the application' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Application ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getApplicationById", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all payments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('payments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the payment' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Get)('messages/student'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all student conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all student conversations' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentConversations", null);
__decorate([
    (0, common_1.Get)('messages/employer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employer conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all employer conversations' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEmployerConversations", null);
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
], AdminController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)('messages/reply/:conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Reply to a conversation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reply sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation ID' }),
    (0, swagger_1.ApiBody)({
        description: 'Reply message',
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    example: 'Thank you for your message. We will assist you with your request.'
                }
            }
        }
    }),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replyToConversation", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        document_service_1.DocumentService,
        payment_service_1.PaymentService,
        message_service_1.MessageService,
        application_service_1.ApplicationService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map