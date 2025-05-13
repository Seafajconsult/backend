import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum NotificationType {
  DOCUMENT_STATUS = "document_status",
  PAYMENT_STATUS = "payment_status",
  APPLICATION_UPDATE = "application_update",
  CHAT_MESSAGE = "chat_message",
  SYSTEM = "system",
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

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop({ type: String })
  link?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
