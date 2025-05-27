import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum DocumentType {
  // Identity Documents
  PASSPORT = "passport",
  NATIONAL_ID = "national_id",
  BIRTH_CERTIFICATE = "birth_certificate",

  // Academic Documents
  TRANSCRIPT = "transcript",
  DEGREE_CERTIFICATE = "degree_certificate",
  PROVISIONAL_CERTIFICATE = "provisional_certificate",
  
  // Test Scores
  ENGLISH_TEST = "english_test", // IELTS, TOEFL, etc.
  OTHER_TEST = "other_test", // GRE, GMAT, etc.
  
  // Financial Documents
  BANK_STATEMENT = "bank_statement",
  SPONSORSHIP_LETTER = "sponsorship_letter",
  SCHOLARSHIP_LETTER = "scholarship_letter",
  
  // Visa Documents
  VISA_APPLICATION = "visa_application",
  PREVIOUS_VISA = "previous_visa",
  
  // Employment Documents
  RESUME = "resume",
  RECOMMENDATION_LETTER = "recommendation_letter",
  WORK_EXPERIENCE = "work_experience",
  
  // Application Documents
  STATEMENT_OF_PURPOSE = "statement_of_purpose",
  OFFER_LETTER = "offer_letter",
  ACCEPTANCE_LETTER = "acceptance_letter",
  
  // Business Documents (for employers)
  BUSINESS_REGISTRATION = "business_registration",
  TAX_CERTIFICATE = "tax_certificate",
  
  // Other
  PHOTOGRAPH = "photograph",
  OTHER = "other"
}

export enum DocumentStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
  REQUIRES_UPDATE = "requires_update"
}

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  cloudinaryId: string;

  @Prop({ required: true })
  cloudinaryUrl: string;

  @Prop({ required: true, enum: DocumentType })
  documentType: DocumentType;

  @Prop({
    required: true,
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Prop()
  rejectionReason?: string;
}

export const UserDocumentSchema = SchemaFactory.createForClass(UserDocument);
