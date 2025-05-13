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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
            api_key: this.configService.get("CLOUDINARY_API_KEY"),
            api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
        });
    }
    async uploadFile(file) {
        if (!file.mimetype.match(/^(application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)|image\/(jpeg|png|jpg))$/)) {
            throw new common_1.BadRequestException("Invalid file type. Only PDF, DOC/DOCX, and JPG/PNG files are allowed.");
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException("File size too large. Maximum size is 5MB.");
        }
        try {
            return await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: "sea-faj-documents",
                    resource_type: "auto",
                    allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(file.buffer);
            });
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload file to Cloudinary");
        }
    }
    async deleteFile(publicId) {
        try {
            return await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to delete file from Cloudinary");
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map