import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum RecruitmentServiceType {
  PRN_PROGRAM = "prn_program", // Subscription-Based Recruitment
  ONE_TIME_RECRUITMENT = "one_time_recruitment",
  FULL_HR_OUTSOURCING = "full_hr_outsourcing",
}

export enum RecruitmentStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  SHORTLISTING = "shortlisting",
  INTERVIEWING = "interviewing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  ON_HOLD = "on_hold",
}

export enum EmploymentType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  TEMPORARY = "temporary",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

@Schema({ timestamps: true })
export class RecruitmentRequest extends Document {
  @Prop({ required: true, unique: true })
  requestId: string; // Unique request reference number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  employerId: string;

  @Prop({ type: String, enum: RecruitmentServiceType, required: true })
  serviceType: RecruitmentServiceType;

  @Prop({ type: String, enum: RecruitmentStatus, default: RecruitmentStatus.PENDING })
  status: RecruitmentStatus;

  // Job Details
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true })
  numberOfPositions: number;

  @Prop({ type: String, enum: EmploymentType, required: true })
  employmentType: EmploymentType;

  @Prop({ required: true })
  preferredStartDate: Date;

  @Prop({ type: Object })
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };

  @Prop()
  additionalRequirements?: string;

  // Employer Details (Pre-filled from registration)
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  employerIdNumber: string; // Auto-generated employer ID

  @Prop({ required: true })
  contactName: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  industry: string;

  // Service Details
  @Prop({ type: Object })
  serviceDetails: {
    duration?: string; // For subscription services
    features: string[];
    pricing: {
      amount: number;
      currency: string;
      billingCycle?: string; // monthly, yearly, one-time
    };
  };

  // Payment Information
  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Payment" })
  paymentId?: string;

  @Prop()
  paymentDueDate?: Date;

  // Progress Tracking
  @Prop({ type: [{ date: Date, status: String, note: String, updatedBy: String }] })
  statusHistory: Array<{
    date: Date;
    status: string;
    note: string;
    updatedBy: string;
  }>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  candidatesShortlisted: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  candidatesInterviewed: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  candidatesHired: string[];

  // Assigned Team
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  assignedRecruiter?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  assignedManager?: string;

  // Communication
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Conversation" })
  conversationId?: string;

  // Documents
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }] })
  documents: string[];

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const RecruitmentRequestSchema = SchemaFactory.createForClass(RecruitmentRequest);

// Recruitment Candidate Schema
@Schema({ timestamps: true })
export class RecruitmentCandidate extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "RecruitmentRequest", required: true })
  recruitmentRequestId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  candidateId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  employerId: string;

  @Prop({ type: String, default: "sourced" })
  status: string; // sourced, contacted, interested, applied, shortlisted, interviewed, offered, hired, rejected

  @Prop({ type: Object })
  candidateProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    experience: string;
    education: string;
    skills: string[];
    currentPosition?: string;
    currentCompany?: string;
    expectedSalary?: number;
    noticePeriod?: string;
  };

  @Prop({ type: Object })
  interviewDetails?: {
    scheduledDate?: Date;
    interviewType?: string;
    feedback?: string;
    rating?: number;
    interviewerNotes?: string;
  };

  @Prop({ type: Object })
  offerDetails?: {
    salary: number;
    currency: string;
    startDate: Date;
    benefits: string[];
    terms: string;
  };

  @Prop({ type: [{ date: Date, status: String, note: String, updatedBy: String }] })
  statusHistory: Array<{
    date: Date;
    status: string;
    note: string;
    updatedBy: string;
  }>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }] })
  documents: string[]; // Resume, cover letter, etc.

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const RecruitmentCandidateSchema = SchemaFactory.createForClass(RecruitmentCandidate);
