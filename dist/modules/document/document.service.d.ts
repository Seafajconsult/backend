import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { UserDocument, DocumentType, DocumentStatus } from "./document.schema";
export declare class DocumentService {
    private documentModel;
    private configService;
    constructor(documentModel: Model<UserDocument>, configService: ConfigService);
    uploadDocument(userId: string, file: Express.Multer.File, documentType: DocumentType): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateDocumentStatus(documentId: string, status: DocumentStatus, rejectionReason?: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserDocuments(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findDocumentById(documentId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteDocument(documentId: string): Promise<void>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
