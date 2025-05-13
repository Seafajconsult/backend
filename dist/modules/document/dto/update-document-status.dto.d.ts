import { DocumentStatus } from "../document.schema";
export declare class UpdateDocumentStatusDto {
    status: DocumentStatus;
    rejectionReason?: string;
}
