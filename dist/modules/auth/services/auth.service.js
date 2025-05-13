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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../user/services/user.service");
const otp_service_1 = require("./otp.service");
const email_service_1 = require("./email.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService, otpService, emailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.otpService = otpService;
        this.emailService = emailService;
    }
    generateUserId() {
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    }
    async generateTokens(user) {
        const payload = { sub: user._id, email: user.email, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync({ ...payload, tokenType: "refresh" }, {
                secret: this.configService.get("app.jwt.refreshSecret"),
                expiresIn: `${this.configService.get("app.jwt.refreshExpiration")}s`,
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async register(createUserDto) {
        this.generateUserId();
        const user = await this.userService.createUser(createUserDto);
        await this.otpService.sendOtp(user.email, "registration");
        return { userId: user.userId };
    }
    async verifyEmail(userId, otp) {
        const user = await this.userService.findById(userId);
        const isValid = await this.otpService.verifyOtp(user.email, otp, "registration");
        if (!isValid) {
            throw new common_1.BadRequestException("Invalid OTP");
        }
        await this.userService.markEmailAsVerified(user._id);
        await this.emailService.sendWelcomeEmail(user.email, user.email.split("@")[0]);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userService.findByEmail(email);
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException("Please verify your email first");
        }
        const isPasswordValid = await this.userService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const tokens = await this.generateTokens(user);
        const userResponse = {
            userId: user._id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        return { user: userResponse, tokens };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get("app.jwt.refreshSecret"),
            });
            const user = await this.userService.findById(payload.sub);
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
    }
    async initiatePasswordReset(email) {
        await this.userService.findByEmail(email);
        await this.otpService.sendOtp(email, "password-reset");
    }
    async resetPassword(email, otp, newPassword) {
        const user = await this.userService.findByEmail(email);
        const isValid = await this.otpService.verifyOtp(email, otp, "password-reset");
        if (!isValid) {
            throw new common_1.BadRequestException("Invalid OTP");
        }
        await this.userService.updatePassword(user._id, newPassword);
    }
    async inviteAdmin(email) {
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException("Email already registered");
        }
        const payload = { email, role: "admin", type: "invitation" };
        const invitationToken = await this.jwtService.signAsync(payload, {
            expiresIn: "24h",
            secret: this.configService.get("app.jwt.invitationSecret"),
        });
        await this.emailService.sendAdminInvitation(email, invitationToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        otp_service_1.OtpService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map