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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialQueryParams = exports.UpdateTestimonialStatusDto = exports.CreateTestimonialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const testimonial_status_enum_1 = require("../enums/testimonial-status.enum");
class CreateTestimonialDto {
}
exports.CreateTestimonialDto = CreateTestimonialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The testimonial text content',
        example: 'My experience with SEA-FAJ Consulting was excellent!',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTestimonialDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the video testimonial if provided',
        example: 'https://example.com/video.mp4',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTestimonialDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rating given by the student (1-5)',
        example: 5,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateTestimonialDto.prototype, "rating", void 0);
class UpdateTestimonialStatusDto {
}
exports.UpdateTestimonialStatusDto = UpdateTestimonialStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The new status for the testimonial',
        enum: testimonial_status_enum_1.TestimonialStatus,
        example: testimonial_status_enum_1.TestimonialStatus.APPROVED,
    }),
    (0, class_validator_1.IsEnum)(testimonial_status_enum_1.TestimonialStatus),
    __metadata("design:type", String)
], UpdateTestimonialStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for rejection if status is REJECTED',
        required: false,
        example: 'Inappropriate content',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTestimonialStatusDto.prototype, "rejectionReason", void 0);
class TestimonialQueryParams {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.TestimonialQueryParams = TestimonialQueryParams;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TestimonialQueryParams.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TestimonialQueryParams.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by status',
        enum: testimonial_status_enum_1.TestimonialStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(testimonial_status_enum_1.TestimonialStatus),
    __metadata("design:type", String)
], TestimonialQueryParams.prototype, "status", void 0);
//# sourceMappingURL=testimonial.dto.js.map