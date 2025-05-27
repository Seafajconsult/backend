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
exports.CreateEmployerProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const employer_profile_schema_1 = require("../../user/schemas/employer-profile.schema");
class CreateEmployerProfileDto {
}
exports.CreateEmployerProfileDto = CreateEmployerProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corporation Ltd.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RC123456' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "businessRegistrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Smith' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "contactPersonName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HR Director' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "contactPersonPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+2341234567890' }),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Technology' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '51-200' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "companySize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Business District, Lagos, Nigeria' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://www.acmecorp.com',
        required: false
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: employer_profile_schema_1.EmployerStatus,
        example: employer_profile_schema_1.EmployerStatus.PENDING,
        default: employer_profile_schema_1.EmployerStatus.PENDING
    }),
    (0, class_validator_1.IsEnum)(employer_profile_schema_1.EmployerStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: employer_profile_schema_1.SubscriptionTier,
        example: employer_profile_schema_1.SubscriptionTier.BASIC,
        default: employer_profile_schema_1.SubscriptionTier.NONE
    }),
    (0, class_validator_1.IsEnum)(employer_profile_schema_1.SubscriptionTier),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployerProfileDto.prototype, "subscriptionTier", void 0);
//# sourceMappingURL=create-employer-profile.dto.js.map