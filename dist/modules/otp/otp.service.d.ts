import { Model } from "mongoose";
import { OTP } from "./otp.schema";
export declare class OTPService {
    private readonly otpModel;
    constructor(otpModel: Model<OTP>);
    generateOTP(email: string): Promise<string>;
    verifyOTP(email: string, code: string): Promise<boolean>;
}
