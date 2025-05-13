import { ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service";
import { Model } from "mongoose";
import { IOtp } from "../schemas/otp.schema";
export declare class OtpService {
    private readonly configService;
    private readonly emailService;
    private readonly otpModel;
    constructor(configService: ConfigService, emailService: EmailService, otpModel: Model<IOtp>);
    private generateOtp;
    private storeOtp;
    private getStoredOtp;
    sendOtp(email: string, purpose: "registration" | "password-reset"): Promise<void>;
    verifyOtp(email: string, otp: string, purpose: "registration" | "password-reset"): Promise<boolean>;
}
