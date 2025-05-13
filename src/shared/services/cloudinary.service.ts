import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

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
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    // Validate file type
    if (
      !file.mimetype.match(
        /^(application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)|image\/(jpeg|png|jpg))$/,
      )
    ) {
      throw new BadRequestException(
        "Invalid file type. Only PDF, DOC/DOCX, and JPG/PNG files are allowed.",
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
      return await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "sea-faj-documents",
            resource_type: "auto",
            allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResponse);
          },
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      throw new BadRequestException("Failed to upload file to Cloudinary");
    }
  }

  async deleteFile(publicId: string) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException("Failed to delete file from Cloudinary");
    }
  }
}
