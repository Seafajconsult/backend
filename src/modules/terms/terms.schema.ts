import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum TermsType {
  GENERAL = "general",
  RECRUITMENT = "recruitment",
  STUDENT_SERVICES = "student_services",
  PRIVACY_POLICY = "privacy_policy",
  COOKIE_POLICY = "cookie_policy",
  DATA_PROCESSING = "data_processing",
}

export enum TermsStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

@Schema({ timestamps: true })
export class Terms extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  version: string; // e.g., "1.0", "2.1"

  @Prop({ type: String, enum: TermsType, required: true })
  type: TermsType;

  @Prop({ type: String, enum: TermsStatus, default: TermsStatus.DRAFT })
  status: TermsStatus;

  @Prop({ required: true })
  content: string; // HTML content of the terms

  @Prop({ required: true })
  effectiveDate: Date;

  @Prop()
  expiryDate?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  approvedBy?: string;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: [String] })
  applicableRoles: string[]; // Which user roles this applies to

  @Prop({ type: Boolean, default: false })
  isRequired: boolean; // Whether acceptance is mandatory

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const TermsSchema = SchemaFactory.createForClass(Terms);

@Schema({ timestamps: true })
export class TermsAcceptance extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Terms", required: true })
  termsId: string;

  @Prop({ required: true })
  termsVersion: string;

  @Prop({ required: true })
  acceptedAt: Date;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ type: Boolean, default: true })
  isAccepted: boolean;

  @Prop()
  withdrawnAt?: Date; // If user withdraws consent

  @Prop()
  withdrawalReason?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const TermsAcceptanceSchema = SchemaFactory.createForClass(TermsAcceptance);
