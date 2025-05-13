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
exports.UpdateApplicationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const application_schema_1 = require("../application.schema");
class OfferDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Offered salary",
        example: 50000,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OfferDetailsDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Job start date",
        example: "2023-09-01",
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], OfferDetailsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Benefits offered",
        example: ["Health insurance", "401k", "Remote work"],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], OfferDetailsDto.prototype, "benefits", void 0);
class UpdateApplicationDto {
}
exports.UpdateApplicationDto = UpdateApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Position being applied for",
        example: "Software Engineer Intern",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: application_schema_1.ApplicationStatus,
        description: "Current status of the application",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(application_schema_1.ApplicationStatus),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Interview date",
        example: "2023-08-15T14:00:00Z",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateApplicationDto.prototype, "interviewDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Notes from the interview",
        example: "Candidate showed strong problem-solving skills",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "interviewNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Details of the job offer",
        required: false,
        type: OfferDetailsDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OfferDetailsDto),
    __metadata("design:type", OfferDetailsDto)
], UpdateApplicationDto.prototype, "offerDetails", void 0);
//# sourceMappingURL=update-application.dto.js.map