import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
    PREFER_NOT_TO_SAY = "prefer_not_to_say"
}
export declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed"
}
export declare class StudentProfile extends Document {
    userId: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: Gender;
    maritalStatus?: MaritalStatus;
    nationality: string;
    passportNumber: string;
    passportExpiryDate: Date;
    phone: string;
    alternativeEmail?: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
        email?: string;
    };
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        startDate: Date;
        endDate: Date;
        gpa: number;
        country: string;
    }>;
    testScores: Array<{
        type: string;
        score: number;
        dateOfTest: Date;
        expiryDate: Date;
    }>;
    workExperience: Array<{
        company: string;
        position: string;
        startDate: Date;
        endDate: Date;
        description: string;
        country: string;
    }>;
    completionStatus: {
        personalInfo: boolean;
        contactInfo: boolean;
        emergencyContact: boolean;
        education: boolean;
        testScores: boolean;
        workExperience: boolean;
        documents: boolean;
    };
    completionPercentage: number;
    updateHistory: Array<{
        field: string;
        oldValue: any;
        newValue: any;
        updatedAt: Date;
        updatedBy: string;
    }>;
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
export declare const StudentProfileSchema: mongoose.Schema<StudentProfile, mongoose.Model<StudentProfile, any, any, any, Document<unknown, any, StudentProfile, any> & StudentProfile & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, StudentProfile, Document<unknown, {}, mongoose.FlatRecord<StudentProfile>, {}> & mongoose.FlatRecord<StudentProfile> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
