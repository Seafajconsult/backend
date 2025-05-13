import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("app.smtp.host"),
      port: this.configService.get("app.smtp.port"),
      auth: {
        user: this.configService.get("app.smtp.user"),
        pass: this.configService.get("app.smtp.password"),
      },
    });
  }

  async sendEmail(options: IEmailOptions): Promise<void> {
    const { to, subject, text, html } = options;
    await this.transporter.sendMail({
      from: this.configService.get("app.smtp.from"),
      to,
      subject,
      text,
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = "Welcome to SEA-FAJ Platform";
    const text = `Dear ${name},\n\nWelcome to the SEA-FAJ Student & Employer Platform! We're excited to have you on board.\n\nBest regards,\nThe SEA-FAJ Team`;
    await this.sendEmail({ to: email, subject, text });
  }

  async sendPasswordResetEmail(email: string, otp: string): Promise<void> {
    const subject = "Password Reset Request - SEA-FAJ Platform";
    const text = `You have requested to reset your password.\n\nYour verification code is: ${otp}\n\nThis code will expire in ${this.configService.get("app.otp.expiration") / 60} minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe SEA-FAJ Team`;
    await this.sendEmail({ to: email, subject, text });
  }

  async sendAdminInvitation(email: string, inviteLink: string): Promise<void> {
    const subject = "Admin Invitation - SEA-FAJ Platform";
    const text = `You have been invited to join the SEA-FAJ Platform as an administrator.\n\nPlease click the following link to complete your registration:\n${inviteLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe SEA-FAJ Team`;
    await this.sendEmail({ to: email, subject, text });
  }
}
