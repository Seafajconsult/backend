import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum DocumentType {
    PASSPORT = "passport",
    NATIONAL_ID = "national_id",
    BIRTH_CERTIFICATE = "birth_certificate",
    TRANSCRIPT = "transcript",
    DEGREE_CERTIFICATE = "degree_certificate",
    PROVISIONAL_CERTIFICATE = "provisional_certificate",
    ENGLISH_TEST = "english_test",
    OTHER_TEST = "other_test",
    BANK_STATEMENT = "bank_statement",
    SPONSORSHIP_LETTER = "sponsorship_letter",
    SCHOLARSHIP_LETTER = "scholarship_letter",
    VISA_APPLICATION = "visa_application",
    PREVIOUS_VISA = "previous_visa",
    RESUME = "resume",
    RECOMMENDATION_LETTER = "recommendation_letter",
    WORK_EXPERIENCE = "work_experience",
    STATEMENT_OF_PURPOSE = "statement_of_purpose",
    OFFER_LETTER = "offer_letter",
    ACCEPTANCE_LETTER = "acceptance_letter",
    BUSINESS_REGISTRATION = "business_registration",
    TAX_CERTIFICATE = "tax_certificate",
    PHOTOGRAPH = "photograph",
    OTHER = "other"
}
export declare enum DocumentStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired",
    REQUIRES_UPDATE = "requires_update"
}
export declare class UserDocument extends Document {
    userId: string;
    originalName: string;
    cloudinaryId: string;
    cloudinaryUrl: string;
    documentType: DocumentType;
    status: DocumentStatus;
    rejectionReason?: string;
}
export declare const UserDocumentSchema: mongoose.Schema<UserDocument, mongoose.Model<UserDocument, any, any, any, Document<unknown, any, UserDocument, any> & UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserDocument, Document<unknown, {}, mongoose.FlatRecord<UserDocument>, {}> & mongoose.FlatRecord<UserDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
