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
exports.CreateStudentProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const student_profile_schema_1 = require("../../user/schemas/student-profile.schema");
class CreateStudentProfileDto {
}
exports.CreateStudentProfileDto = CreateStudentProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+2341234567890' }),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1995-05-15' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateStudentProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nigerian' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main St, Lagos, Nigeria' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "currentAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: student_profile_schema_1.StudentStatus,
        example: student_profile_schema_1.StudentStatus.ACTIVE,
        default: student_profile_schema_1.StudentStatus.ACTIVE
    }),
    (0, class_validator_1.IsEnum)(student_profile_schema_1.StudentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['UK', 'US', 'CA'],
        description: 'ISO 3166-1 alpha-2 country codes'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsISO31661Alpha2)({ each: true }),
    __metadata("design:type", Array)
], CreateStudentProfileDto.prototype, "preferredCountries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Computer Science', 'Software Engineering']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateStudentProfileDto.prototype, "preferredCourses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bachelor of Science' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "highestEducation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'University of Lagos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "currentInstitution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStudentProfileDto.prototype, "graduationYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IELTS' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "englishTestType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.5 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStudentProfileDto.prototype, "englishTestScore", void 0);
//# sourceMappingURL=create-student-profile.dto.js.map