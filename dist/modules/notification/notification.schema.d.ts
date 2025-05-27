import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum NotificationType {
    DOCUMENT_UPLOADED = "document_uploaded",
    DOCUMENT_VERIFIED = "document_verified",
    DOCUMENT_REJECTED = "document_rejected",
    DOCUMENT_EXPIRING = "document_expiring",
    APPLICATION_SUBMITTED = "application_submitted",
    APPLICATION_STATUS_CHANGE = "application_status_change",
    APPLICATION_REVIEW = "application_review",
    OFFER_RECEIVED = "offer_received",
    PAYMENT_INITIATED = "payment_initiated",
    PAYMENT_SUCCESSFUL = "payment_successful",
    PAYMENT_FAILED = "payment_failed",
    INVOICE_GENERATED = "invoice_generated",
    VISA_APPOINTMENT = "visa_appointment",
    VISA_STATUS_UPDATE = "visa_status_update",
    VISA_APPROVED = "visa_approved",
    VISA_REJECTED = "visa_rejected",
    NEW_MESSAGE = "new_message",
    ADVISOR_ASSIGNED = "advisor_assigned",
    MEETING_SCHEDULED = "meeting_scheduled",
    NEW_REFERRAL = "new_referral",
    REFERRAL_REGISTERED = "referral_registered",
    REFERRAL_BONUS = "referral_bonus",
    FLIGHT_REMINDER = "flight_reminder",
    ORIENTATION_REMINDER = "orientation_reminder",
    ACCOMMODATION_UPDATE = "accommodation_update",
    ACCOUNT_UPDATE = "account_update",
    PROFILE_INCOMPLETE = "profile_incomplete",
    MAINTENANCE = "maintenance",
    SYSTEM_UPDATE = "system_update"
}
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum NotificationChannel {
    IN_APP = "in_app",
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push"
}
export declare class Notification extends Document {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    channels: NotificationChannel[];
    isRead: boolean;
    isArchived: boolean;
    data?: Record<string, any>;
    link?: string;
    scheduledFor?: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, Document<unknown, any, Notification, any> & Notification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Notification, Document<unknown, {}, mongoose.FlatRecord<Notification>, {}> & mongoose.FlatRecord<Notification> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
