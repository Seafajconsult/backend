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
exports.CreateApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AcademicDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bachelor of Science' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcademicDetailsDto.prototype, "highestQualification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'University of Lagos' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcademicDetailsDto.prototype, "institution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AcademicDetailsDto.prototype, "graduationYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.8 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AcademicDetailsDto.prototype, "cgpa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            type: 'IELTS',
            score: 7.5,
            dateOfTest: '2024-12-01'
        },
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EnglishTestDto),
    __metadata("design:type", EnglishTestDto)
], AcademicDetailsDto.prototype, "englishTest", void 0);
class EnglishTestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IELTS' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnglishTestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EnglishTestDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-01' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], EnglishTestDto.prototype, "dateOfTest", void 0);
class CreateApplicationDto {
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Computer Science' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'University of Oxford' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "university", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United Kingdom' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fall 2025' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "intake", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AcademicDetailsDto),
    __metadata("design:type", AcademicDetailsDto)
], CreateApplicationDto.prototype, "academicDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['60d21b4667d0d8992e610c85'],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateApplicationDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "additionalInformation", void 0);
//# sourceMappingURL=create-application.dto.js.map