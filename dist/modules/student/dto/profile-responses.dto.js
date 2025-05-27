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
exports.ProfileUpdateHistoryResponse = exports.ProfileUpdateHistoryItem = exports.ProfileCompletionResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProfileCompletionResponse {
}
exports.ProfileCompletionResponse = ProfileCompletionResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The percentage of profile completion',
        example: 85,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], ProfileCompletionResponse.prototype, "completionPercentage", void 0);
class ProfileUpdateHistoryItem {
}
exports.ProfileUpdateHistoryItem = ProfileUpdateHistoryItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the update was made',
        example: '2025-05-25T10:30:00Z'
    }),
    __metadata("design:type", Date)
], ProfileUpdateHistoryItem.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of fields that were updated',
        example: ['education', 'skills']
    }),
    __metadata("design:type", Array)
], ProfileUpdateHistoryItem.prototype, "updatedFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous values of the updated fields',
        example: {
            education: [{
                    degree: 'Bachelor of Science',
                    field: 'Computer Science'
                }]
        }
    }),
    __metadata("design:type", Object)
], ProfileUpdateHistoryItem.prototype, "previousValues", void 0);
class ProfileUpdateHistoryResponse {
}
exports.ProfileUpdateHistoryResponse = ProfileUpdateHistoryResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of profile updates',
        type: [ProfileUpdateHistoryItem]
    }),
    __metadata("design:type", Array)
], ProfileUpdateHistoryResponse.prototype, "updates", void 0);
//# sourceMappingURL=profile-responses.dto.js.map