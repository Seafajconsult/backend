import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum ApplicationStatus {
  // Initial States
  DRAFT = "draft",
  SUBMITTED = "submitted",
  
  // Document Processing
  DOCUMENT_REVIEW = "document_review",
  DOCUMENTS_APPROVED = "documents_approved",
  DOCUMENTS_REJECTED = "documents_rejected",
  
  // School Application
  SENT_TO_SCHOOL = "sent_to_school",
  SCHOOL_REVIEWING = "school_reviewing",
  ADDITIONAL_DOCS_REQUIRED = "additional_docs_required",
  
  // Interview Process
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_COMPLETED = "interview_completed",
  
  // Offer Stage
  OFFER_RECEIVED = "offer_received",
  OFFER_ACCEPTED = "offer_accepted",
  OFFER_REJECTED = "offer_rejected",
  
  // Visa Process
  VISA_PROCESSING = "visa_processing",
  VISA_APPROVED = "visa_approved",
  VISA_REJECTED = "visa_rejected",
  
  // Final States
  PRE_DEPARTURE = "pre_departure",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  studentId: string;

  @Prop({ required: true, unique: true })
  applicationId: string; // Unique application reference number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  employerId?: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  intake: string; // e.g., "Fall 2025"

  @Prop({
    required: true,
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }] })
  documents: string[];

  @Prop({ type: Object })
  academicDetails: {
    highestQualification: string;
    institution: string;
    graduationYear: number;
    cgpa: number;
    englishTest?: {
      type: string; // IELTS, TOEFL, etc.
      score: number;
      dateOfTest: Date;
    };
  };

  @Prop({ type: Object })
  visaDetails?: {
    applicationDate?: Date;
    appointmentDate?: Date;
    status?: string;
    visaNumber?: string;
    expiryDate?: Date;
    documents: string[];
  };

  @Prop({ type: Object })
  offerDetails?: {
    offerLetterUrl: string;
    tuitionFee: number;
    scholarship?: number;
    acceptanceDeadline: Date;
    startDate: Date;
    programDuration: string;
    additionalRequirements?: string[];
  };

  @Prop({ type: Object })
  preDepartureDetails?: {
    flightDetails?: string;
    accommodationArranged: boolean;
    orientationDate?: Date;
    checklistCompleted: boolean;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  assignedAdvisor: string;

  @Prop({ type: [{ date: Date, status: String, note: String }] })
  statusHistory: { date: Date; status: string; note: string; }[];

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
