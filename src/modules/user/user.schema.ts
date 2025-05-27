import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum UserRole {
  STUDENT = "student",
  EMPLOYER = "employer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // 9-digit unique ID

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' })
  studentProfile?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployerProfile' })
  employerProfile?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ type: [String] })
  fcmTokens?: string[]; // For push notifications

  @Prop()
  referralCode?: string; // Unique referral code for this user

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  referredBy?: string; // User who referred this user

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  referrals?: string[]; // Users referred by this user

  @Prop({ type: Object })
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    timezone: string;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
