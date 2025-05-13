import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { OTPService } from "../otp/otp.service";
import { NotificationService } from "../notification/notification.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private readonly userService;
    private readonly otpService;
    private readonly jwtService;
    private readonly notificationService;
    constructor(userService: UserService, otpService: OTPService, jwtService: JwtService, notificationService: NotificationService);
    register(registerDto: RegisterDto): Promise<{
        userId: string;
        message: string;
    }>;
    verifyEmail(userId: string, otp: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    inviteAdmin(email: string): Promise<{
        message: string;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
}
