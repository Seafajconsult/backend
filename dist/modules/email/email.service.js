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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const user_service_1 = require("../user/user.service");
let EmailService = class EmailService {
    constructor(configService, userService) {
        this.configService = configService;
        this.userService = userService;
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
    async sendOTP(email, otp) {
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
    async sendAdminInvitation(email, inviteToken) {
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
    async sendNotificationEmail(userId, title, message) {
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
    async sendApplicationStatusUpdate(userId, applicationId, status, details) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], EmailService);
//# sourceMappingURL=email.service.js.map