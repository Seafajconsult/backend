import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../user.service';
import { NotificationService } from '../../notification/notification.service';
import { ReferralCodeDto, ReferralStatsResponseDto } from '../dto/referral.dto';
import { RequestWithUser } from '../../../interfaces/request.interface';

@ApiTags('Referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get user referral statistics' })
  @ApiResponse({ status: 200, type: ReferralStatsResponseDto })
  async getReferralStats(@Req() req: RequestWithUser) {
    return this.userService.getReferralStats(req.user.userId);
  }

  @Get('code')
  @ApiOperation({ summary: 'Get user referral code' })
  async getReferralCode(@Req() req: RequestWithUser) {
    const user = await this.userService.findById(req.user.userId);
    return { referralCode: user.referralCode };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a referral code' })
  async validateReferralCode(@Body() referralCodeDto: ReferralCodeDto) {
    const referrer = await this.userService.findByReferralCode(referralCodeDto.referralCode);
    return {
      isValid: !!referrer,
      referrerEmail: referrer ? referrer.email : null,
    };
  }
}
