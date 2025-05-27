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
exports.ReferralService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const notification_service_1 = require("../../notification/notification.service");
const config_1 = require("@nestjs/config");
let ReferralService = class ReferralService {
    constructor(userService, notificationService, configService) {
        this.userService = userService;
        this.notificationService = notificationService;
        this.configService = configService;
        this.referralBonusAmount = this.configService.get('app.referral.bonusAmount') || 50;
    }
    async processReferral(referrer, referredUser) {
        await this.notificationService.notifyNewReferral(referrer.userId, {
            userId: referredUser.userId,
            email: referredUser.email,
        });
        await this.notificationService.notifyReferralBonus(referrer.userId, this.referralBonusAmount);
    }
    async validateReferralCode(referralCode) {
        const referrer = await this.userService.findByReferralCode(referralCode);
        if (!referrer) {
            throw new common_1.BadRequestException('Invalid referral code');
        }
        return referrer;
    }
    async getReferralStats(userId) {
        const stats = await this.userService.getReferralStats(userId);
        return {
            ...stats,
            potentialBonus: stats.totalReferrals * this.referralBonusAmount,
        };
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        notification_service_1.NotificationService,
        config_1.ConfigService])
], ReferralService);
//# sourceMappingURL=referral.service.js.map