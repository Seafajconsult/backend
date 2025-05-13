import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { ConfigService } from "@nestjs/config";
import { UserDocument, DocumentType, DocumentStatus } from "./document.schema";

// Define Cloudinary response type
interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
  url: string;
  [key: string]: any;
}

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(UserDocument.name) private documentModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    documentType: DocumentType,
  ) {
    // Validate file type
    if (
      !file.mimetype.match(
        /^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
      )
    ) {
      throw new BadRequestException(
        "Invalid file type. Only PDF and DOC/DOCX files are allowed.",
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException(
        "File size too large. Maximum size is 5MB.",
      );
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "sea-faj-documents",
            resource_type: "raw",
            allowed_formats: ["pdf", "doc", "docx"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResponse);
          },
        );

        uploadStream.end(file.buffer);
      });

      // Save document reference to database
      const document = await this.documentModel.create({
        userId,
        originalName: file.originalname,
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        documentType,
        status: DocumentStatus.PENDING,
      });

      return document;
    } catch (error) {
      throw new BadRequestException("Failed to upload document");
    }
  }

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    rejectionReason?: string,
  ) {
    const document = await this.documentModel.findById(documentId);
    if (!document) {
      throw new BadRequestException("Document not found");
    }

    document.status = status;
    if (status === DocumentStatus.REJECTED && rejectionReason) {
      document.rejectionReason = rejectionReason;
    }

    return document.save();
  }

  async getUserDocuments(userId: string) {
    return this.documentModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findDocumentById(documentId: string) {
    const document = await this.documentModel.findById(documentId);
    if (!document) {
      throw new NotFoundException("Document not found");
    }
    return document;
  }

  async deleteDocument(documentId: string) {
    const document = await this.documentModel.findById(documentId);
    if (!document) {
      throw new NotFoundException("Document not found");
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.cloudinaryId);

    // Delete from database
    await document.deleteOne();
  }

  async findAll() {
    return this.documentModel.find().sort({ createdAt: -1 });
  }
}
