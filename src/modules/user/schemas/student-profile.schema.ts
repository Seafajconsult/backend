import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum StudentStatus {
  ACTIVE = 'active',
  APPLIED = 'applied',
  ENROLLED = 'enrolled',
  GRADUATED = 'graduated',
  INACTIVE = 'inactive'
}

@Schema({ timestamps: true })
export class StudentProfile extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  nationality: string;

  @Prop()
  currentAddress: string;

  @Prop({ type: String, enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @Prop({ type: [String] })
  preferredCountries: string[];

  @Prop({ type: [String] })
  preferredCourses: string[];

  @Prop()
  highestEducation: string;

  @Prop()
  currentInstitution?: string;

  @Prop()
  graduationYear?: number;

  @Prop()
  englishTestType?: string; // IELTS, TOEFL, etc.

  @Prop()
  englishTestScore?: number;

  @Prop({ type: String, unique: true })
  referralCode: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  referrals: string[];

  @Prop()
  seaFajAdvisor?: string;

  @Prop({ type: Object })
  testimonial?: {
    rating: number;
    comment: string;
    videoUrl?: string;
    createdAt: Date;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);
