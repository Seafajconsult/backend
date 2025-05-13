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
const bcrypt = require("bcryptjs");
const user_service_1 = require("../user/user.service");
const otp_service_1 = require("../otp/otp.service");
const notification_service_1 = require("../notification/notification.service");
const user_schema_1 = require("../user/user.schema");
let AuthService = class AuthService {
    constructor(userService, otpService, jwtService, notificationService) {
        this.userService = userService;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }
    async register(registerDto) {
        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException("Email already registered");
        }
        const userId = await this.userService.generateUniqueUserId();
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            ...registerDto,
            userId,
            password: hashedPassword,
            isEmailVerified: false,
        });
        const otp = await this.otpService.generateOTP(registerDto.email);
        await this.notificationService.notifyNewUserRegistration(userId, registerDto.email, registerDto.role || user_schema_1.UserRole.STUDENT);
        return {
            userId,
            message: "Registration successful. Please verify your email with the OTP sent.",
        };
    }
    async verifyEmail(userId, otp) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const isValid = await this.otpService.verifyOTP(user.email, otp);
        if (!isValid) {
            throw new common_1.BadRequestException("Invalid or expired OTP");
        }
        await this.userService.markEmailAsVerified(userId);
        return { message: "Email verified successfully" };
    }
    async login(loginDto) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !user.isEmailVerified) {
            throw new common_1.UnauthorizedException("Invalid credentials or unverified email");
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(user),
            this.generateRefreshToken(user),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException("Invalid refresh token");
            }
            return {
                access_token: await this.generateAccessToken(user),
            };
        }
        catch {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
    }
    async inviteAdmin(email) {
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException("Email already registered");
        }
        const userId = await this.userService.generateUniqueUserId();
        const temporaryPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        await this.userService.create({
            email,
            password: hashedPassword,
            userId,
            role: user_schema_1.UserRole.ADMIN,
            isEmailVerified: true,
        });
        return { message: "Admin invitation sent successfully" };
    }
    async generateAccessToken(user) {
        const payload = { sub: user.userId, email: user.email, role: user.role };
        return this.jwtService.sign(payload, { expiresIn: "15m" });
    }
    async generateRefreshToken(user) {
        const payload = { sub: user.userId };
        return this.jwtService.sign(payload, { expiresIn: "7d" });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        otp_service_1.OTPService,
        jwt_1.JwtService,
        notification_service_1.NotificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map