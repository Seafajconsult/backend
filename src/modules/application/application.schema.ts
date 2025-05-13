import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum ApplicationStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  DOCUMENT_REVIEW = "document_review",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_COMPLETED = "interview_completed",
  OFFER_PENDING = "offer_pending",
  OFFER_ACCEPTED = "offer_accepted",
  OFFER_REJECTED = "offer_rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  studentId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  employerId: string;

  @Prop({ required: true })
  position: string;

  @Prop({
    required: true,
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }] })
  documents: string[];

  @Prop({ type: Date })
  interviewDate?: Date;

  @Prop()
  interviewNotes?: string;

  @Prop({ type: Object })
  offerDetails?: {
    salary: number;
    startDate: Date;
    benefits: string[];
  };

  @Prop({ type: [String] })
  statusHistory: string[];
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
