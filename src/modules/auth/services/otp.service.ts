import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Otp, IOtp } from "../schemas/otp.schema";

@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @InjectModel(Otp.name) private readonly otpModel: Model<IOtp>,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async storeOtp(
    email: string,
    otp: string,
    purpose: "registration" | "password-reset",
  ): Promise<void> {
    const expiry = new Date();
    expiry.setSeconds(
      expiry.getSeconds() + this.configService.get("app.otp.expiration"),
    );

    // Remove any existing OTP for this email and purpose
    await this.otpModel.deleteMany({ email, purpose });

    // Store new OTP
    await this.otpModel.create({
      email,
      otp,
      purpose,
      expiry,
    });
  }

  private async getStoredOtp(
    email: string,
    purpose: "registration" | "password-reset",
  ): Promise<IOtp> {
    const storedOtp = await this.otpModel
      .findOne({ email, purpose })
      .sort({ createdAt: -1 });
    if (!storedOtp) {
      throw new NotFoundException("OTP not found or expired");
    }
    return storedOtp;
  }

  async sendOtp(
    email: string,
    purpose: "registration" | "password-reset",
  ): Promise<void> {
    const otp = this.generateOtp();
    await this.storeOtp(email, otp, purpose);

    const subject =
      purpose === "registration"
        ? "Email Verification - SEA-FAJ Platform"
        : "Password Reset - SEA-FAJ Platform";

    const text =
      `Your verification code is: ${otp}\n\n` +
      `This code will expire in ${this.configService.get("app.otp.expiration") / 60} minutes.\n\n` +
      "If you did not request this code, please ignore this email.";

    await this.emailService.sendEmail({
      to: email,
      subject,
      text,
    });
  }

  async verifyOtp(
    email: string,
    otp: string,
    purpose: "registration" | "password-reset",
  ): Promise<boolean> {
    try {
      const storedOtp = await this.getStoredOtp(email, purpose);
      const isValid = storedOtp.expiry > new Date() && storedOtp.otp === otp;

      if (isValid) {
        // Remove the OTP after successful verification
        await this.otpModel.deleteOne({ _id: storedOtp._id });
      }

      return isValid;
    } catch (error) {
      return false;
    }
  }
}
