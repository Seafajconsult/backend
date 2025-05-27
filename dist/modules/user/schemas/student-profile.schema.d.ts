import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare enum StudentStatus {
    ACTIVE = "active",
    APPLIED = "applied",
    ENROLLED = "enrolled",
    GRADUATED = "graduated",
    INACTIVE = "inactive"
}
export declare class StudentProfile extends Document {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    nationality: string;
    currentAddress: string;
    status: StudentStatus;
    preferredCountries: string[];
    preferredCourses: string[];
    highestEducation: string;
    currentInstitution?: string;
    graduationYear?: number;
    englishTestType?: string;
    englishTestScore?: number;
    referralCode: string;
    referrals: string[];
    seaFajAdvisor?: string;
    testimonial?: {
        rating: number;
        comment: string;
        videoUrl?: string;
        createdAt: Date;
    };
    metadata?: Record<string, any>;
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
