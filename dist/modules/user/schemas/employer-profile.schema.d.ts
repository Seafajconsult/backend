import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare enum EmployerStatus {
    PENDING = "pending",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    INACTIVE = "inactive"
}
export declare enum SubscriptionTier {
    NONE = "none",
    BASIC = "basic",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise"
}
export declare class EmployerProfile extends Document {
    userId: string;
    companyName: string;
    businessRegistrationNumber: string;
    contactPersonName: string;
    contactPersonPosition: string;
    phoneNumber: string;
    industry: string;
    companySize: string;
    address: string;
    website?: string;
    status: EmployerStatus;
    subscriptionTier: SubscriptionTier;
    subscriptionExpiryDate?: Date;
    verificationDocuments: string[];
    metadata?: Record<string, any>;
}
export declare const EmployerProfileSchema: mongoose.Schema<EmployerProfile, mongoose.Model<EmployerProfile, any, any, any, Document<unknown, any, EmployerProfile, any> & EmployerProfile & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, EmployerProfile, Document<unknown, {}, mongoose.FlatRecord<EmployerProfile>, {}> & mongoose.FlatRecord<EmployerProfile> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
