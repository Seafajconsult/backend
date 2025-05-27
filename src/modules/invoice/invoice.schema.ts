import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum InvoiceType {
  APPLICATION_FEE = "application_fee",
  SERVICE_CHARGE = "service_charge",
  CONSULTATION_FEE = "consultation_fee",
  RECRUITMENT_FEE = "recruitment_fee",
  SUBSCRIPTION_FEE = "subscription_fee",
  JOB_POSTING_FEE = "job_posting_fee",
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ required: true, unique: true })
  invoiceNumber: string; // Unique invoice number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: string; // Student or Employer

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Payment" })
  paymentId?: string;

  @Prop({ type: String, enum: InvoiceType, required: true })
  invoiceType: InvoiceType;

  @Prop({ type: String, enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  // Invoice Details
  @Prop({ required: true })
  issueDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paidDate?: Date;

  // Billing Information
  @Prop({ type: Object, required: true })
  billTo: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
    company?: string;
    taxId?: string;
  };

  @Prop({ type: Object, required: true })
  billFrom: {
    name: string;
    email: string;
    address: string;
    phone: string;
    company: string;
    taxId?: string;
    logo?: string;
  };

  // Line Items
  @Prop({ type: [Object], required: true })
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate?: number;
    taxAmount?: number;
  }>;

  // Totals
  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  taxAmount: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  currency: string;

  // Additional Information
  @Prop()
  notes?: string;

  @Prop()
  terms?: string;

  @Prop()
  pdfUrl?: string; // URL to generated PDF

  // Related Documents
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Application" })
  applicationId?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "RecruitmentRequest" })
  recruitmentRequestId?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Job" })
  jobId?: string;

  // Payment Tracking
  @Prop({ type: [{ date: Date, amount: Number, method: String, transactionId: String }] })
  paymentHistory: Array<{
    date: Date;
    amount: number;
    method: string;
    transactionId: string;
  }>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Invoice Template Schema for customization
@Schema({ timestamps: true })
export class InvoiceTemplate extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  templateType: string; // default, custom, branded

  @Prop({ type: Object })
  design: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl?: string;
    headerText?: string;
    footerText?: string;
  };

  @Prop({ type: Object })
  defaultTerms: {
    paymentTerms: string;
    notes: string;
    lateFeePenalty?: number;
  };

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy?: string;
}

export const InvoiceTemplateSchema = SchemaFactory.createForClass(InvoiceTemplate);
