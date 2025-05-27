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
exports.StudentProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const student_profile_service_1 = require("../services/student-profile.service");
const update_student_profile_dto_1 = require("../dto/update-student-profile.dto");
const profile_responses_dto_1 = require("../dto/profile-responses.dto");
let StudentProfileController = class StudentProfileController {
    constructor(studentProfileService) {
        this.studentProfileService = studentProfileService;
    }
    async getCurrentProfile(req) {
        return this.studentProfileService.findByUserId(req.user.id);
    }
    async updateProfile(req, updateProfileDto) {
        return this.studentProfileService.update(req.user.id, updateProfileDto);
    }
    async getProfileCompletion(req) {
        return this.studentProfileService.calculateProfileCompletion(req.user.id);
    }
    async getUpdateHistory(req) {
        return this.studentProfileService.getUpdateHistory(req.user.id);
    }
};
exports.StudentProfileController = StudentProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current student profile',
        description: 'Retrieves the complete profile information for the currently authenticated student'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
        type: update_student_profile_dto_1.UpdateStudentProfileDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentProfileController.prototype, "getCurrentProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update student profile',
        description: 'Updates the profile information for the currently authenticated student'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
        type: update_student_profile_dto_1.UpdateStudentProfileDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_student_profile_dto_1.UpdateStudentProfileDto]),
    __metadata("design:returntype", Promise)
], StudentProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('completion'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get profile completion percentage',
        description: 'Calculates and retrieves the profile completion percentage'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile completion retrieved successfully',
        type: profile_responses_dto_1.ProfileCompletionResponse
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentProfileController.prototype, "getProfileCompletion", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get profile update history',
        description: 'Retrieves the history of all updates made to the student profile'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile update history retrieved successfully',
        type: profile_responses_dto_1.ProfileUpdateHistoryResponse
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentProfileController.prototype, "getUpdateHistory", null);
exports.StudentProfileController = StudentProfileController = __decorate([
    (0, swagger_1.ApiTags)('Student Profile'),
    (0, common_1.Controller)('student-profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_profile_service_1.StudentProfileService])
], StudentProfileController);
//# sourceMappingURL=student-profile.controller.js.map