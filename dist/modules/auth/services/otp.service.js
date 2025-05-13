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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./email.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const otp_schema_1 = require("../schemas/otp.schema");
let OtpService = class OtpService {
    constructor(configService, emailService, otpModel) {
        this.configService = configService;
        this.emailService = emailService;
        this.otpModel = otpModel;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async storeOtp(email, otp, purpose) {
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + this.configService.get("app.otp.expiration"));
        await this.otpModel.deleteMany({ email, purpose });
        await this.otpModel.create({
            email,
            otp,
            purpose,
            expiry,
        });
    }
    async getStoredOtp(email, purpose) {
        const storedOtp = await this.otpModel
            .findOne({ email, purpose })
            .sort({ createdAt: -1 });
        if (!storedOtp) {
            throw new common_1.NotFoundException("OTP not found or expired");
        }
        return storedOtp;
    }
    async sendOtp(email, purpose) {
        const otp = this.generateOtp();
        await this.storeOtp(email, otp, purpose);
        const subject = purpose === "registration"
            ? "Email Verification - SEA-FAJ Platform"
            : "Password Reset - SEA-FAJ Platform";
        const text = `Your verification code is: ${otp}\n\n` +
            `This code will expire in ${this.configService.get("app.otp.expiration") / 60} minutes.\n\n` +
            "If you did not request this code, please ignore this email.";
        await this.emailService.sendEmail({
            to: email,
            subject,
            text,
        });
    }
    async verifyOtp(email, otp, purpose) {
        try {
            const storedOtp = await this.getStoredOtp(email, purpose);
            const isValid = storedOtp.expiry > new Date() && storedOtp.otp === otp;
            if (isValid) {
                await this.otpModel.deleteOne({ _id: storedOtp._id });
            }
            return isValid;
        }
        catch (error) {
            return false;
        }
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService,
        mongoose_2.Model])
], OtpService);
//# sourceMappingURL=otp.service.js.map