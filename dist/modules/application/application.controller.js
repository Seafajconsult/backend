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
exports.ApplicationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../user/user.schema");
const application_service_1 = require("./application.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const swagger_1 = require("@nestjs/swagger");
let ApplicationController = class ApplicationController {
    constructor(applicationService) {
        this.applicationService = applicationService;
    }
    async findAll() {
        return this.applicationService.findAll();
    }
    async getMyApplications(req) {
        if (req.user.role === user_schema_1.UserRole.STUDENT) {
            return this.applicationService.findByStudent(req.user.userId);
        }
        else if (req.user.role === user_schema_1.UserRole.EMPLOYER) {
            return this.applicationService.findByEmployer(req.user.userId);
        }
        throw new common_1.ForbiddenException("Access denied");
    }
    async findOne(id, req) {
        const application = await this.applicationService.findOne(id);
        if (req.user.role !== user_schema_1.UserRole.ADMIN &&
            req.user.role !== user_schema_1.UserRole.SUPER_ADMIN &&
            application.studentId.toString() !== req.user.userId &&
            application.employerId.toString() !== req.user.userId) {
            throw new common_1.ForbiddenException("Access denied");
        }
        return application;
    }
    async create(createApplicationDto, req) {
        return this.applicationService.create(req.user.userId, createApplicationDto);
    }
    async update(id, updateApplicationDto, req) {
        const application = await this.applicationService.findOne(id);
        if (req.user.role !== user_schema_1.UserRole.ADMIN &&
            req.user.role !== user_schema_1.UserRole.SUPER_ADMIN &&
            application.studentId.toString() !== req.user.userId &&
            application.employerId.toString() !== req.user.userId) {
            throw new common_1.ForbiddenException("Access denied");
        }
        if (req.user.role === user_schema_1.UserRole.STUDENT &&
            (updateApplicationDto.interviewDate ||
                updateApplicationDto.interviewNotes ||
                updateApplicationDto.offerDetails)) {
            throw new common_1.ForbiddenException("Students cannot update interview or offer details");
        }
        return this.applicationService.update(id, updateApplicationDto);
    }
    async addDocument(id, documentId, req) {
        const application = await this.applicationService.findOne(id);
        if (application.studentId.toString() !== req.user.userId) {
            throw new common_1.ForbiddenException("Access denied");
        }
        return this.applicationService.addDocument(id, documentId);
    }
    async delete(id, req) {
        const application = await this.applicationService.findOne(id);
        if (req.user.role !== user_schema_1.UserRole.ADMIN &&
            req.user.role !== user_schema_1.UserRole.SUPER_ADMIN &&
            application.studentId.toString() !== req.user.userId) {
            throw new common_1.ForbiddenException("Access denied");
        }
        await this.applicationService.delete(id);
        return { message: "Application deleted successfully" };
    }
};
exports.ApplicationController = ApplicationController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Get all applications (Admin only)" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("my-applications"),
    (0, swagger_1.ApiOperation)({ summary: "Get current user's applications" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get application by ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: "Create a new application" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update an application" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/documents/:documentId"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: "Add a document to an application" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("documentId")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete an application" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "delete", null);
exports.ApplicationController = ApplicationController = __decorate([
    (0, swagger_1.ApiTags)("Applications"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("applications"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationController);
//# sourceMappingURL=application.controller.js.map