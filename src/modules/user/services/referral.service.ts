import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { NotificationService } from '../../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user.schema';

@Injectable()
export class ReferralService {
  private referralBonusAmount: number;

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {
    this.referralBonusAmount = this.configService.get<number>('app.referral.bonusAmount') || 50;
  }

  async processReferral(referrer: User, referredUser: User): Promise<void> {
    // Send notification to referrer
    await this.notificationService.notifyNewReferral(
      referrer.userId,
      {
        userId: referredUser.userId,
        email: referredUser.email,
      }
    );

    // If we want to award a bonus, we can notify the referrer
    await this.notificationService.notifyReferralBonus(
      referrer.userId,
      this.referralBonusAmount
    );

    // Additional referral processing logic can be added here
    // For example:
    // - Track referral conversion
    // - Award points or credits
    // - Update referral statistics
  }

  async validateReferralCode(referralCode: string): Promise<User> {
    const referrer = await this.userService.findByReferralCode(referralCode);
    if (!referrer) {
      throw new BadRequestException('Invalid referral code');
    }
    return referrer;
  }

  async getReferralStats(userId: string) {
    const stats = await this.userService.getReferralStats(userId);
    return {
      ...stats,
      potentialBonus: stats.totalReferrals * this.referralBonusAmount,
    };
  }
}
