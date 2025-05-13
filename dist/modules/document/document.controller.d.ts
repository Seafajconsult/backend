import { DocumentService } from "./document.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentStatusDto } from "./dto/update-document-status.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class DocumentController {
    private readonly documentService;
    constructor(documentService: DocumentService);
    uploadDocument(req: RequestWithUser, file: Express.Multer.File, createDocumentDto: CreateDocumentDto): Promise<import("mongoose").Document<unknown, {}, import("./document.schema").UserDocument, {}> & import("./document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMyDocuments(req: RequestWithUser): Promise<(import("mongoose").Document<unknown, {}, import("./document.schema").UserDocument, {}> & import("./document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserDocuments(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./document.schema").UserDocument, {}> & import("./document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateDocumentStatus(id: string, updateStatusDto: UpdateDocumentStatusDto): Promise<import("mongoose").Document<unknown, {}, import("./document.schema").UserDocument, {}> & import("./document.schema").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteDocument(id: string, req: RequestWithUser): Promise<void>;
}
