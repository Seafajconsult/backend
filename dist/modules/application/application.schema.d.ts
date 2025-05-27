import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum ApplicationStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    DOCUMENT_REVIEW = "document_review",
    DOCUMENTS_APPROVED = "documents_approved",
    DOCUMENTS_REJECTED = "documents_rejected",
    SENT_TO_SCHOOL = "sent_to_school",
    SCHOOL_REVIEWING = "school_reviewing",
    ADDITIONAL_DOCS_REQUIRED = "additional_docs_required",
    INTERVIEW_SCHEDULED = "interview_scheduled",
    INTERVIEW_COMPLETED = "interview_completed",
    OFFER_RECEIVED = "offer_received",
    OFFER_ACCEPTED = "offer_accepted",
    OFFER_REJECTED = "offer_rejected",
    VISA_PROCESSING = "visa_processing",
    VISA_APPROVED = "visa_approved",
    VISA_REJECTED = "visa_rejected",
    PRE_DEPARTURE = "pre_departure",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Application extends Document {
    studentId: string;
    applicationId: string;
    employerId?: string;
    course: string;
    university: string;
    country: string;
    intake: string;
    status: ApplicationStatus;
    documents: string[];
    academicDetails: {
        highestQualification: string;
        institution: string;
        graduationYear: number;
        cgpa: number;
        englishTest?: {
            type: string;
            score: number;
            dateOfTest: Date;
        };
    };
    visaDetails?: {
        applicationDate?: Date;
        appointmentDate?: Date;
        status?: string;
        visaNumber?: string;
        expiryDate?: Date;
        documents: string[];
    };
    offerDetails?: {
        offerLetterUrl: string;
        tuitionFee: number;
        scholarship?: number;
        acceptanceDeadline: Date;
        startDate: Date;
        programDuration: string;
        additionalRequirements?: string[];
    };
    preDepartureDetails?: {
        flightDetails?: string;
        accommodationArranged: boolean;
        orientationDate?: Date;
        checklistCompleted: boolean;
    };
    assignedAdvisor: string;
    statusHistory: {
        date: Date;
        status: string;
        note: string;
    }[];
    metadata?: Record<string, any>;
}
export declare const ApplicationSchema: mongoose.Schema<Application, mongoose.Model<Application, any, any, any, Document<unknown, any, Application, any> & Application & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Application, Document<unknown, {}, mongoose.FlatRecord<Application>, {}> & mongoose.FlatRecord<Application> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
