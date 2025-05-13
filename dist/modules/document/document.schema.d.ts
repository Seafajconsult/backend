import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum DocumentType {
    PASSPORT = "passport",
    TRANSCRIPT = "transcript",
    TEST_SCORE = "test_score",
    OFFER_LETTER = "offer_letter",
    OTHER = "other"
}
export declare enum DocumentStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
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
