import { IsString, IsOptional } from 'class-validator';

export class ReferralCodeDto {
  @IsString()
  @IsOptional()
  referralCode?: string;
}

export class ReferralStatsResponseDto {
  totalReferrals: number;
  referredUsers: Array<{
    userId: string;
    email: string;
    createdAt: Date;
  }>;
  referredBy?: {
    userId: string;
    email: string;
  };
}
