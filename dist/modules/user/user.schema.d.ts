import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum UserRole {
    STUDENT = "student",
    EMPLOYER = "employer",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User extends Document {
    userId: string;
    email: string;
    password: string;
    role: UserRole;
    isEmailVerified: boolean;
    isActive: boolean;
    studentProfile?: string;
    employerProfile?: string;
    lastLoginAt?: Date;
    fcmTokens?: string[];
    referralCode?: string;
    referredBy?: string;
    referrals?: string[];
    preferences?: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        language: string;
        timezone: string;
    };
    metadata?: Record<string, any>;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, Document<unknown, {}, mongoose.FlatRecord<User>, {}> & mongoose.FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
