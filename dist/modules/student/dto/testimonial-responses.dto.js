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
exports.TestimonialListResponse = exports.TestimonialResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class TestimonialResponse {
}
exports.TestimonialResponse = TestimonialResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the testimonial',
        example: '507f1f77bcf86cd799439011'
    }),
    __metadata("design:type", String)
], TestimonialResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the student who submitted the testimonial',
        example: '507f1f77bcf86cd799439012'
    }),
    __metadata("design:type", String)
], TestimonialResponse.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The testimonial text content',
        example: 'My experience with SEA-FAJ Consulting was excellent!'
    }),
    __metadata("design:type", String)
], TestimonialResponse.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the video testimonial if provided',
        example: 'https://example.com/video.mp4',
        required: false
    }),
    __metadata("design:type", String)
], TestimonialResponse.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rating given by the student (1-5)',
        example: 5,
        minimum: 1,
        maximum: 5
    }),
    __metadata("design:type", Number)
], TestimonialResponse.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current status of the testimonial',
        example: 'approved',
        enum: ['pending', 'approved', 'rejected']
    }),
    __metadata("design:type", String)
], TestimonialResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the testimonial was created',
        example: '2025-05-25T10:30:00Z'
    }),
    __metadata("design:type", Date)
], TestimonialResponse.prototype, "createdAt", void 0);
class TestimonialListResponse {
}
exports.TestimonialListResponse = TestimonialListResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of testimonials',
        type: [TestimonialResponse]
    }),
    __metadata("design:type", Array)
], TestimonialListResponse.prototype, "testimonials", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
        example: {
            total: 100,
            page: 1,
            limit: 10,
            pages: 10
        }
    }),
    __metadata("design:type", Object)
], TestimonialListResponse.prototype, "pagination", void 0);
//# sourceMappingURL=testimonial-responses.dto.js.map