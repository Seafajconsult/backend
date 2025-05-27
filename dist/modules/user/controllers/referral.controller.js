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
exports.ReferralController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../../notification/notification.service");
const referral_dto_1 = require("../dto/referral.dto");
let ReferralController = class ReferralController {
    constructor(userService, notificationService) {
        this.userService = userService;
        this.notificationService = notificationService;
    }
    async getReferralStats(req) {
        return this.userService.getReferralStats(req.user.userId);
    }
    async getReferralCode(req) {
        const user = await this.userService.findById(req.user.userId);
        return { referralCode: user.referralCode };
    }
    async validateReferralCode(referralCodeDto) {
        const referrer = await this.userService.findByReferralCode(referralCodeDto.referralCode);
        return {
            isValid: !!referrer,
            referrerName: referrer ? `${referrer.firstName} ${referrer.lastName}` : null,
        };
    }
};
exports.ReferralController = ReferralController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user referral statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: referral_dto_1.ReferralStatsResponseDto }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralController.prototype, "getReferralStats", null);
__decorate([
    (0, common_1.Get)('code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user referral code' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralController.prototype, "getReferralCode", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a referral code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [referral_dto_1.ReferralCodeDto]),
    __metadata("design:returntype", Promise)
], ReferralController.prototype, "validateReferralCode", null);
exports.ReferralController = ReferralController = __decorate([
    (0, swagger_1.ApiTags)('Referrals'),
    (0, common_1.Controller)('referrals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService,
        notification_service_1.NotificationService])
], ReferralController);
//# sourceMappingURL=referral.controller.js.map