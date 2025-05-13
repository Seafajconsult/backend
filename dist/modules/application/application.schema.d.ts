import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum ApplicationStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    DOCUMENT_REVIEW = "document_review",
    INTERVIEW_SCHEDULED = "interview_scheduled",
    INTERVIEW_COMPLETED = "interview_completed",
    OFFER_PENDING = "offer_pending",
    OFFER_ACCEPTED = "offer_accepted",
    OFFER_REJECTED = "offer_rejected",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Application extends Document {
    studentId: string;
    employerId: string;
    position: string;
    status: ApplicationStatus;
    documents: string[];
    interviewDate?: Date;
    interviewNotes?: string;
    offerDetails?: {
        salary: number;
        startDate: Date;
        benefits: string[];
    };
    statusHistory: string[];
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
