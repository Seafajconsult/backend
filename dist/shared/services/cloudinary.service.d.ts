import { ConfigService } from "@nestjs/config";
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
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse>;
    deleteFile(publicId: string): Promise<any>;
}
export {};
