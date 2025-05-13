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
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("app.smtp.host"),
            port: this.configService.get("app.smtp.port"),
            auth: {
                user: this.configService.get("app.smtp.user"),
                pass: this.configService.get("app.smtp.password"),
            },
        });
    }
    async sendEmail(options) {
        const { to, subject, text, html } = options;
        await this.transporter.sendMail({
            from: this.configService.get("app.smtp.from"),
            to,
            subject,
            text,
            html,
        });
    }
    async sendWelcomeEmail(email, name) {
        const subject = "Welcome to SEA-FAJ Platform";
        const text = `Dear ${name},\n\nWelcome to the SEA-FAJ Student & Employer Platform! We're excited to have you on board.\n\nBest regards,\nThe SEA-FAJ Team`;
        await this.sendEmail({ to: email, subject, text });
    }
    async sendPasswordResetEmail(email, otp) {
        const subject = "Password Reset Request - SEA-FAJ Platform";
        const text = `You have requested to reset your password.\n\nYour verification code is: ${otp}\n\nThis code will expire in ${this.configService.get("app.otp.expiration") / 60} minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe SEA-FAJ Team`;
        await this.sendEmail({ to: email, subject, text });
    }
    async sendAdminInvitation(email, inviteLink) {
        const subject = "Admin Invitation - SEA-FAJ Platform";
        const text = `You have been invited to join the SEA-FAJ Platform as an administrator.\n\nPlease click the following link to complete your registration:\n${inviteLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe SEA-FAJ Team`;
        await this.sendEmail({ to: email, subject, text });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map