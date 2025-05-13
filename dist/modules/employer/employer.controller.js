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
exports.EmployerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../user/user.schema");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
const message_service_1 = require("../message/message.service");
const application_service_1 = require("../application/application.service");
const register_dto_1 = require("../auth/dto/register.dto");
const verify_otp_dto_1 = require("../auth/dto/verify-otp.dto");
const login_dto_1 = require("../auth/dto/login.dto");
const conversation_schema_1 = require("../message/conversation.schema");
const common_2 = require("@nestjs/common");
let EmployerController = class EmployerController {
    constructor(authService, userService, messageService, applicationService) {
        this.authService = authService;
        this.userService = userService;
        this.messageService = messageService;
        this.applicationService = applicationService;
    }
    async register(registerDto) {
        const employerDto = { ...registerDto, role: user_schema_1.UserRole.EMPLOYER };
        return this.authService.register(employerDto);
    }
    async verifyEmail(verifyOtpDto) {
        return this.authService.verifyEmail(verifyOtpDto.userId, verifyOtpDto.otp);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async refreshToken(refreshToken) {
        return this.authService.refreshToken(refreshToken);
    }
    async getEmployerApplications(req) {
        return this.applicationService.findByEmployer(req.user.userId);
    }
    async getApplicationById(id, req) {
        return this.applicationService.findOne(id);
    }
    async getStatus(req) {
        return {
            status: 'active',
            userId: req.user.userId,
            role: req.user.role
        };
    }
    async messageAdmin(req, content) {
        const adminUsers = await this.userService.findByRole(user_schema_1.UserRole.ADMIN);
        if (!adminUsers || adminUsers.length === 0) {
            throw new common_2.NotFoundException('No admin users available');
        }
        const adminUser = adminUsers[0];
        const existingConversations = await this.messageService.findConversationsByParticipants([req.user.userId, adminUser.userId], conversation_schema_1.ConversationType.EMPLOYER_ADMIN);
        let conversation;
        if (existingConversations.length > 0) {
            conversation = existingConversations[0];
        }
        else {
            conversation = await this.messageService.createConversation({
                participants: [req.user.userId, adminUser.userId],
                type: conversation_schema_1.ConversationType.EMPLOYER_ADMIN
            });
        }
        const message = await this.messageService.createMessage(req.user.userId, {
            conversationId: conversation._id.toString(),
            content
        });
        return {
            conversation,
            message
        };
    }
    async getAdminMessages(req) {
        const adminConversations = await this.messageService.findUserConversationsByType(req.user.userId, conversation_schema_1.ConversationType.EMPLOYER_ADMIN);
        if (adminConversations.length === 0) {
            return { conversations: [], messages: [] };
        }
        const latestConversation = adminConversations[0];
        const messages = await this.messageService.findConversationMessages(latestConversation._id.toString(), 50, 0);
        return {
            conversation: latestConversation,
            messages
        };
    }
};
exports.EmployerController = EmployerController;
__decorate([
    (0, common_1.Post)('auth/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new employer account' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Employer account created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth/verify-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify employer email with OTP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid OTP' }),
    (0, swagger_1.ApiBody)({ type: verify_otp_dto_1.VerifyOtpDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Employer login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh authentication token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)('refresh_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.EMPLOYER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications for the employer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all applications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "getEmployerApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.EMPLOYER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific application by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the application' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Application ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "getApplicationById", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.EMPLOYER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get employer account status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns employer status information' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('messages/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.EMPLOYER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start or continue a conversation with an admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Conversation created or retrieved successfully' }),
    (0, swagger_1.ApiBody)({
        description: 'Message to send to admin',
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    example: 'Hello, I need help with posting a job.'
                }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "messageAdmin", null);
__decorate([
    (0, common_1.Get)('messages/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.EMPLOYER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin conversation messages' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns admin conversation messages' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployerController.prototype, "getAdminMessages", null);
exports.EmployerController = EmployerController = __decorate([
    (0, swagger_1.ApiTags)('Employer'),
    (0, common_1.Controller)('employer'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        message_service_1.MessageService,
        application_service_1.ApplicationService])
], EmployerController);
//# sourceMappingURL=employer.controller.js.map