import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OTP } from "./otp.schema";

@Injectable()
export class OTPService {
  constructor(@InjectModel(OTP.name) private readonly otpModel: Model<OTP>) {}

  async generateOTP(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.otpModel.create({
      email,
      code,
      expiresAt,
    });

    return code;
  }

  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpModel.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (otp) {
      await this.otpModel.deleteOne({ _id: otp._id });
      return true;
    }

    return false;
  }
}
