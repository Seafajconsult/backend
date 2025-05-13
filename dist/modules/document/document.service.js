"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
const document_schema_1 = require("./document.schema");
let DocumentService = class DocumentService {
    constructor(documentModel, configService) {
        this.documentModel = documentModel;
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
            api_key: this.configService.get("CLOUDINARY_API_KEY"),
            api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
        });
    }
    async uploadDocument(userId, file, documentType) {
        if (!file.mimetype.match(/^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
            throw new common_1.BadRequestException("Invalid file type. Only PDF and DOC/DOCX files are allowed.");
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException("File size too large. Maximum size is 5MB.");
        }
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: "sea-faj-documents",
                    resource_type: "raw",
                    allowed_formats: ["pdf", "doc", "docx"],
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(file.buffer);
            });
            const document = await this.documentModel.create({
                userId,
                originalName: file.originalname,
                cloudinaryId: result.public_id,
                cloudinaryUrl: result.secure_url,
                documentType,
                status: document_schema_1.DocumentStatus.PENDING,
            });
            return document;
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload document");
        }
    }
    async updateDocumentStatus(documentId, status, rejectionReason) {
        const document = await this.documentModel.findById(documentId);
        if (!document) {
            throw new common_1.BadRequestException("Document not found");
        }
        document.status = status;
        if (status === document_schema_1.DocumentStatus.REJECTED && rejectionReason) {
            document.rejectionReason = rejectionReason;
        }
        return document.save();
    }
    async getUserDocuments(userId) {
        return this.documentModel.find({ userId }).sort({ createdAt: -1 });
    }
    async findDocumentById(documentId) {
        const document = await this.documentModel.findById(documentId);
        if (!document) {
            throw new common_1.NotFoundException("Document not found");
        }
        return document;
    }
    async deleteDocument(documentId) {
        const document = await this.documentModel.findById(documentId);
        if (!document) {
            throw new common_1.NotFoundException("Document not found");
        }
        await cloudinary_1.v2.uploader.destroy(document.cloudinaryId);
        await document.deleteOne();
    }
    async findAll() {
        return this.documentModel.find().sort({ createdAt: -1 });
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_schema_1.UserDocument.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], DocumentService);
//# sourceMappingURL=document.service.js.map