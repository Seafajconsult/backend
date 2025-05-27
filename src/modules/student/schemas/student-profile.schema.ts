import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

@Schema({ timestamps: true })
export class StudentProfile extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  // Personal Information
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  middleName?: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ enum: MaritalStatus })
  maritalStatus?: MaritalStatus;

  @Prop()
  nationality: string;

  @Prop()
  passportNumber: string;

  @Prop()
  passportExpiryDate: Date;

  // Contact Information
  @Prop({ required: true })
  phone: string;

  @Prop()
  alternativeEmail?: string;

  @Prop({ type: Object, required: true })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Emergency Contact
  @Prop({ type: Object })
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };

  // Educational Background
  @Prop([{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: Number,
    country: String
  }])
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date;
    gpa: number;
    country: string;
  }>;

  // Test Scores
  @Prop([{
    type: String, // IELTS, TOEFL, GRE, GMAT, etc.
    score: Number,
    dateOfTest: Date,
    expiryDate: Date
  }])
  testScores: Array<{
    type: string;
    score: number;
    dateOfTest: Date;
    expiryDate: Date;
  }>;

  // Professional Experience
  @Prop([{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
    country: String
  }])
  workExperience: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate: Date;
    description: string;
    country: string;
  }>;

  // Profile Completion
  @Prop({ type: Object, default: {} })
  completionStatus: {
    personalInfo: boolean;
    contactInfo: boolean;
    emergencyContact: boolean;
    education: boolean;
    testScores: boolean;
    workExperience: boolean;
    documents: boolean;
  };

  @Prop({ type: Number, default: 0 })
  completionPercentage: number;

  // Profile History
  @Prop([{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }])
  updateHistory: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    updatedAt: Date;
    updatedBy: string;
  }>;

  // Preferences
  @Prop({ type: Object, default: {} })
  preferences: {
    preferredStudyCountries: string[];
    preferredStudyLevel: string;
    budgetRange: {
      min: number;
      max: number;
      currency: string;
    };
    intakePreference: string[];
  };
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);
