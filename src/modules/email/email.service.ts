import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { UserService } from "../user/user.service";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get("BREVO_SMTP_USER"),
        pass: this.configService.get("BREVO_SMTP_PASSWORD"),
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get("EMAIL_FROM"),
      to: email,
      subject: "Email Verification - SEA-FAJ Platform",
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendAdminInvitation(email: string, inviteToken: string): Promise<void> {
    const inviteUrl = `${this.configService.get("FRONTEND_URL")}/admin/register?token=${inviteToken}`;

    const mailOptions = {
      from: this.configService.get("EMAIL_FROM"),
      to: email,
      subject: "Admin Invitation - SEA-FAJ Platform",
      html: `
        <h1>Admin Invitation</h1>
        <p>You have been invited to join SEA-FAJ Platform as an administrator.</p>
        <p>Please click the link below to complete your registration:</p>
        <a href="${inviteUrl}">Complete Registration</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendNotificationEmail(userId: string, title: string, message: string): Promise<void> {
    // Get user email
    const user = await this.userService.findById(userId);

    if (!user || !user.email) {
      throw new Error('User not found or email not available');
    }

    const mailOptions = {
      from: this.configService.get("EMAIL_FROM"),
      to: user.email,
      subject: title,
      html: `
        <h1>${title}</h1>
        <p>${message}</p>
        <p>Please log in to your SEA-FAJ account to view more details.</p>
        <a href="${this.configService.get("FRONTEND_URL")}/login">Log in to SEA-FAJ</a>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendApplicationStatusUpdate(userId: string, applicationId: string, status: string, details?: string): Promise<void> {
    // Get user email
    const user = await this.userService.findById(userId);

    if (!user || !user.email) {
      throw new Error('User not found or email not available');
    }

    const applicationUrl = `${this.configService.get("FRONTEND_URL")}/applications/${applicationId}`;

    const mailOptions = {
      from: this.configService.get("EMAIL_FROM"),
      to: user.email,
      subject: `Application Status Update: ${status}`,
      html: `
        <h1>Application Status Update</h1>
        <p>Your application status has been updated to: <strong>${status}</strong></p>
        ${details ? `<p>${details}</p>` : ''}
        <p>Please click the link below to view your application:</p>
        <a href="${applicationUrl}">View Application</a>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
