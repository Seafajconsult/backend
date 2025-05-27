import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsBoolean, IsOptional, ValidateNested, IsDateString } from "class-validator";
import { Type } from "class-transformer";
import { RewardType, RewardStatus } from "../referral.schema";

export class ProcessReferralDto {
  @ApiProperty({ description: "Referral code used", example: "REF123ABC" })
  @IsString()
  @IsNotEmpty()
  referralCode: string;

  @ApiProperty({ description: "Referee user ID" })
  @IsString()
  @IsNotEmpty()
  refereeId: string;
}

export class UpdateReferralStatusDto {
  @ApiProperty({ description: "New referral status", example: "qualified" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: "Status update note", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

class RewardConfigDto {
  @ApiProperty({ description: "Reward type", enum: RewardType, example: RewardType.CASH })
  @IsEnum(RewardType)
  type: RewardType;

  @ApiProperty({ description: "Reward value", example: 50 })
  @IsNumber()
  value: number;

  @ApiProperty({ description: "Currency", example: "USD" })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: "Reward description", example: "Cash reward for successful referral" })
  @IsString()
  @IsNotEmpty()
  description: string;
}

class QualificationCriteriaDto {
  @ApiProperty({ description: "Email verification required", example: true })
  @IsBoolean()
  emailVerification: boolean;

  @ApiProperty({ description: "Profile completion required", example: true })
  @IsBoolean()
  profileCompletion: boolean;

  @ApiProperty({ description: "First application required", example: true })
  @IsBoolean()
  firstApplication: boolean;

  @ApiProperty({ description: "First payment required", example: true })
  @IsBoolean()
  firstPayment: boolean;

  @ApiProperty({ description: "Minimum payment amount", required: false, example: 100 })
  @IsNumber()
  @IsOptional()
  minimumPaymentAmount?: number;

  @ApiProperty({ description: "Time limit in days", required: false, example: 30 })
  @IsNumber()
  @IsOptional()
  timeLimit?: number;
}

class ProgramLimitsDto {
  @ApiProperty({ description: "Max referrals per user", required: false, example: 10 })
  @IsNumber()
  @IsOptional()
  maxReferralsPerUser?: number;

  @ApiProperty({ description: "Max rewards per user", required: false, example: 5 })
  @IsNumber()
  @IsOptional()
  maxRewardsPerUser?: number;

  @ApiProperty({ description: "Total program budget", required: false, example: 10000 })
  @IsNumber()
  @IsOptional()
  totalProgramBudget?: number;

  @ApiProperty({ description: "Max rewards per month", required: false, example: 100 })
  @IsNumber()
  @IsOptional()
  maxRewardsPerMonth?: number;
}

export class CreateReferralProgramDto {
  @ApiProperty({ description: "Program name", example: "Student Referral Program 2024" })
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiProperty({ description: "Program description", example: "Refer friends and earn rewards" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Program start date", example: "2024-01-01T00:00:00.000Z" })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: "Program end date", required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ 
    description: "Reward configuration",
    example: {
      referrerReward: { type: "cash", value: 50, currency: "USD", description: "Cash reward" },
      refereeReward: { type: "discount", value: 25, currency: "USD", description: "Discount on first service" }
    }
  })
  @ValidateNested()
  @Type(() => Object)
  rewardConfig: {
    referrerReward: RewardConfigDto;
    refereeReward?: RewardConfigDto;
  };

  @ApiProperty({ description: "Qualification criteria", type: QualificationCriteriaDto })
  @ValidateNested()
  @Type(() => QualificationCriteriaDto)
  qualificationCriteria: QualificationCriteriaDto;

  @ApiProperty({ description: "Program limits", type: ProgramLimitsDto, required: false })
  @ValidateNested()
  @Type(() => ProgramLimitsDto)
  @IsOptional()
  limits?: ProgramLimitsDto;
}

export class CreateRewardDto {
  @ApiProperty({ description: "Referral ID" })
  @IsString()
  @IsNotEmpty()
  referralId: string;

  @ApiProperty({ description: "User ID receiving the reward" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: "Reward type", enum: RewardType, example: RewardType.CASH })
  @IsEnum(RewardType)
  rewardType: RewardType;

  @ApiProperty({ description: "Reward value", example: 50 })
  @IsNumber()
  rewardValue: number;

  @ApiProperty({ description: "Currency", example: "USD" })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: "Reward description", example: "Referral bonus" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Expiry date", required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}

export class UpdateRewardStatusDto {
  @ApiProperty({ description: "New reward status", enum: RewardStatus, example: RewardStatus.APPROVED })
  @IsEnum(RewardStatus)
  status: RewardStatus;

  @ApiProperty({ description: "Status update note", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class ProcessRewardPaymentDto {
  @ApiProperty({ description: "Payment method", example: "bank_transfer" })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: "Account details", required: false })
  @IsString()
  @IsOptional()
  accountDetails?: string;

  @ApiProperty({ description: "Transaction ID", example: "TXN123456789" })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: "Processing fee", required: false, example: 2.5 })
  @IsNumber()
  @IsOptional()
  processingFee?: number;
}
