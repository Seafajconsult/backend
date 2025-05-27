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
exports.TestimonialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const testimonial_service_1 = require("../services/testimonial.service");
const testimonial_dto_1 = require("../dto/testimonial.dto");
const testimonial_responses_dto_1 = require("../dto/testimonial-responses.dto");
const testimonial_status_enum_1 = require("../enums/testimonial-status.enum");
let TestimonialController = class TestimonialController {
    constructor(testimonialService) {
        this.testimonialService = testimonialService;
    }
    async create(req, createTestimonialDto) {
        return this.testimonialService.create(req.user.id, createTestimonialDto);
    }
    async findAll(query) {
        return this.testimonialService.findAll({
            page: query.page ?? 1,
            limit: query.limit ?? 10,
            status: testimonial_status_enum_1.TestimonialStatus.APPROVED
        });
    }
    async findUserTestimonials(req) {
        return this.testimonialService.findByUserId(req.user.id);
    }
    async updateStatus(req, id, updateStatusDto) {
        return this.testimonialService.updateStatus(id, updateStatusDto.status, updateStatusDto.rejectionReason);
    }
    async remove(req, id) {
        return this.testimonialService.delete(req.user.id, id);
    }
};
exports.TestimonialController = TestimonialController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new testimonial',
        description: 'Submit a new text or video testimonial'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Testimonial created successfully',
        type: testimonial_responses_dto_1.TestimonialResponse
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, testimonial_dto_1.CreateTestimonialDto]),
    __metadata("design:returntype", Promise)
], TestimonialController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all approved testimonials',
        description: 'Retrieve paginated list of approved testimonials'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 10)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of testimonials retrieved successfully',
        type: testimonial_responses_dto_1.TestimonialListResponse
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [testimonial_dto_1.TestimonialQueryParams]),
    __metadata("design:returntype", Promise)
], TestimonialController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user testimonials',
        description: 'Retrieve all testimonials submitted by the current user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User testimonials retrieved successfully',
        type: [testimonial_responses_dto_1.TestimonialResponse]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestimonialController.prototype, "findUserTestimonials", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update testimonial status',
        description: 'Update the status of a testimonial. Only admins can approve/reject testimonials.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Testimonial ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Testimonial status updated successfully',
        type: testimonial_responses_dto_1.TestimonialResponse
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or testimonial not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only admins can update status' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, testimonial_dto_1.UpdateTestimonialStatusDto]),
    __metadata("design:returntype", Promise)
], TestimonialController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a testimonial',
        description: 'Delete a testimonial. Users can only delete their own testimonials.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Testimonial ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Testimonial deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or testimonial not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only delete own testimonials' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TestimonialController.prototype, "remove", null);
exports.TestimonialController = TestimonialController = __decorate([
    (0, swagger_1.ApiTags)('Student Testimonials'),
    (0, common_1.Controller)('testimonials'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [testimonial_service_1.TestimonialService])
], TestimonialController);
//# sourceMappingURL=testimonial.controller.js.map