import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum EmployerStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

export enum SubscriptionTier {
  NONE = 'none',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

@Schema({ timestamps: true })
export class EmployerProfile extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  businessRegistrationNumber: string;

  @Prop({ required: true })
  contactPersonName: string;

  @Prop({ required: true })
  contactPersonPosition: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true })
  companySize: string; // e.g., "1-10", "11-50", "51-200", "201-500", "500+"

  @Prop({ required: true })
  address: string;

  @Prop()
  website?: string;

  @Prop({ type: String, enum: EmployerStatus, default: EmployerStatus.PENDING })
  status: EmployerStatus;

  @Prop({ type: String, enum: SubscriptionTier, default: SubscriptionTier.NONE })
  subscriptionTier: SubscriptionTier;

  @Prop()
  subscriptionExpiryDate?: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }] })
  verificationDocuments: string[];

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const EmployerProfileSchema = SchemaFactory.createForClass(EmployerProfile);
