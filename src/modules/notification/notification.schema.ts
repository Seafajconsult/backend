import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum NotificationType {
  // Document Related
  DOCUMENT_UPLOADED = "document_uploaded",
  DOCUMENT_VERIFIED = "document_verified",
  DOCUMENT_REJECTED = "document_rejected",
  DOCUMENT_EXPIRING = "document_expiring",
  
  // Application Related
  APPLICATION_SUBMITTED = "application_submitted",
  APPLICATION_STATUS_CHANGE = "application_status_change",
  APPLICATION_REVIEW = "application_review",
  OFFER_RECEIVED = "offer_received",
  
  // Payment Related
  PAYMENT_INITIATED = "payment_initiated",
  PAYMENT_SUCCESSFUL = "payment_successful",
  PAYMENT_FAILED = "payment_failed",
  INVOICE_GENERATED = "invoice_generated",
  
  // Visa Related
  VISA_APPOINTMENT = "visa_appointment",
  VISA_STATUS_UPDATE = "visa_status_update",
  VISA_APPROVED = "visa_approved",
  VISA_REJECTED = "visa_rejected",
  
  // Communication
  NEW_MESSAGE = "new_message",
  ADVISOR_ASSIGNED = "advisor_assigned",
  MEETING_SCHEDULED = "meeting_scheduled",
  
  // Referral Related
  NEW_REFERRAL = "new_referral",
  REFERRAL_REGISTERED = "referral_registered",
  REFERRAL_BONUS = "referral_bonus",
  
  // Pre-departure
  FLIGHT_REMINDER = "flight_reminder",
  ORIENTATION_REMINDER = "orientation_reminder",
  ACCOMMODATION_UPDATE = "accommodation_update",
  
  // System
  ACCOUNT_UPDATE = "account_update",
  PROFILE_INCOMPLETE = "profile_incomplete",
  MAINTENANCE = "maintenance",
  SYSTEM_UPDATE = "system_update"
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push"
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  @Prop({ type: [String], enum: NotificationChannel, default: [NotificationChannel.IN_APP] })
  channels: NotificationChannel[];

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop({ type: String })
  link?: string;

  @Prop({ type: Date })
  scheduledFor?: Date;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
