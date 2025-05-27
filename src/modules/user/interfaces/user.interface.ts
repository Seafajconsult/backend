import { Document } from "mongoose";

export interface IUser extends Document {
  readonly userId: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly isEmailVerified: boolean;
  readonly isActive: boolean;
  readonly studentProfile?: string;
  readonly employerProfile?: string;
  readonly lastLoginAt?: Date;
  readonly fcmTokens?: string[];
  readonly referralCode?: string;
  readonly referredBy?: string;
  readonly referrals?: string[];
  readonly preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    timezone: string;
  };
  readonly metadata?: Record<string, any>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  STUDENT = "student",
  EMPLOYER = "employer",
}

export interface IUserResponse {
  userId: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  referralCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
