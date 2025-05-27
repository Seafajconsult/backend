import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum ReferralStatus {
  PENDING = "pending",
  QUALIFIED = "qualified",
  REWARDED = "rewarded",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum RewardType {
  CASH = "cash",
  CREDIT = "credit",
  DISCOUNT = "discount",
  POINTS = "points",
  SERVICE_CREDIT = "service_credit",
}

export enum RewardStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  REJECTED = "rejected",
}

@Schema({ timestamps: true })
export class Referral extends Document {
  @Prop({ required: true, unique: true })
  referralId: string; // Unique referral tracking ID

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  referrerId: string; // User who made the referral

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  refereeId: string; // User who was referred

  @Prop({ required: true })
  referralCode: string; // Code used for the referral

  @Prop({ type: String, enum: ReferralStatus, default: ReferralStatus.PENDING })
  status: ReferralStatus;

  @Prop({ required: true })
  referralDate: Date;

  @Prop()
  qualificationDate?: Date; // When the referral qualified for reward

  @Prop()
  rewardDate?: Date; // When the reward was given

  // Qualification criteria tracking
  @Prop({ type: Object })
  qualificationCriteria: {
    emailVerified: boolean;
    profileCompleted: boolean;
    firstApplicationSubmitted: boolean;
    firstPaymentMade: boolean;
    customCriteria?: Record<string, boolean>;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);

@Schema({ timestamps: true })
export class ReferralReward extends Document {
  @Prop({ required: true, unique: true })
  rewardId: string; // Unique reward ID

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Referral", required: true })
  referralId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: string; // User receiving the reward

  @Prop({ type: String, enum: RewardType, required: true })
  rewardType: RewardType;

  @Prop({ type: String, enum: RewardStatus, default: RewardStatus.PENDING })
  status: RewardStatus;

  @Prop({ required: true })
  rewardValue: number; // Amount or value of the reward

  @Prop({ required: true })
  currency: string;

  @Prop()
  description: string;

  @Prop()
  expiryDate?: Date;

  @Prop()
  claimedDate?: Date;

  @Prop()
  paidDate?: Date;

  // Payment details
  @Prop({ type: Object })
  paymentDetails?: {
    method: string; // bank_transfer, paypal, credit, etc.
    accountDetails?: string;
    transactionId?: string;
    processingFee?: number;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ReferralRewardSchema = SchemaFactory.createForClass(ReferralReward);

@Schema({ timestamps: true })
export class ReferralProgram extends Document {
  @Prop({ required: true })
  programName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  // Reward configuration
  @Prop({ type: Object, required: true })
  rewardConfig: {
    referrerReward: {
      type: RewardType;
      value: number;
      currency: string;
      description: string;
    };
    refereeReward?: {
      type: RewardType;
      value: number;
      currency: string;
      description: string;
    };
  };

  // Qualification criteria
  @Prop({ type: Object, required: true })
  qualificationCriteria: {
    emailVerification: boolean;
    profileCompletion: boolean;
    firstApplication: boolean;
    firstPayment: boolean;
    minimumPaymentAmount?: number;
    timeLimit?: number; // days
    customCriteria?: Record<string, any>;
  };

  // Program limits
  @Prop({ type: Object })
  limits: {
    maxReferralsPerUser?: number;
    maxRewardsPerUser?: number;
    totalProgramBudget?: number;
    maxRewardsPerMonth?: number;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ReferralProgramSchema = SchemaFactory.createForClass(ReferralProgram);
