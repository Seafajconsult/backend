import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum JobStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PAUSED = "paused",
  CLOSED = "closed",
  EXPIRED = "expired",
}

export enum JobType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  TEMPORARY = "temporary",
}

export enum ExperienceLevel {
  ENTRY_LEVEL = "entry_level",
  MID_LEVEL = "mid_level",
  SENIOR_LEVEL = "senior_level",
  EXECUTIVE = "executive",
}

export enum ApplicationStatus {
  APPLIED = "applied",
  UNDER_REVIEW = "under_review",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEWED = "interviewed",
  OFFERED = "offered",
  HIRED = "hired",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true, unique: true })
  jobId: string; // Unique job reference number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  employerId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  requirements: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: String, enum: JobType, required: true })
  jobType: JobType;

  @Prop({ type: String, enum: ExperienceLevel, required: true })
  experienceLevel: ExperienceLevel;

  @Prop({ type: Object, required: true })
  salary: {
    min: number;
    max: number;
    currency: string;
    negotiable: boolean;
  };

  @Prop({ type: [String] })
  skills: string[];

  @Prop({ type: [String] })
  benefits: string[];

  @Prop({ required: true })
  applicationDeadline: Date;

  @Prop({ type: String, enum: JobStatus, default: JobStatus.DRAFT })
  status: JobStatus;

  @Prop({ type: Number, default: 0 })
  applicationsCount: number;

  @Prop({ type: Number, default: 0 })
  viewsCount: number;

  @Prop({ type: Object })
  companyInfo: {
    name: string;
    logo?: string;
    website?: string;
    industry: string;
    size: string;
  };

  @Prop({ type: Object })
  contactInfo: {
    email: string;
    phone?: string;
    contactPerson: string;
  };

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Boolean, default: false })
  isRemote: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const JobSchema = SchemaFactory.createForClass(Job);

// Job Application Schema
@Schema({ timestamps: true })
export class JobApplication extends Document {
  @Prop({ required: true, unique: true })
  applicationId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true })
  jobId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  applicantId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  employerId: string;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @Prop({ type: String })
  coverLetter?: string;

  @Prop({ type: String })
  resumeUrl?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }] })
  documents: string[];

  @Prop({ type: Object })
  applicantProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    experience: string;
    education: string;
    skills: string[];
  };

  @Prop({ type: [{ date: Date, status: String, note: String, updatedBy: String }] })
  statusHistory: Array<{
    date: Date;
    status: string;
    note: string;
    updatedBy: string;
  }>;

  @Prop({ type: Object })
  interviewDetails?: {
    scheduledDate?: Date;
    interviewType?: string; // video, phone, in-person
    meetingLink?: string;
    location?: string;
    interviewerNotes?: string;
    feedback?: string;
    rating?: number;
  };

  @Prop({ type: Object })
  offerDetails?: {
    salary: number;
    currency: string;
    startDate: Date;
    benefits: string[];
    terms: string;
    expiryDate: Date;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
