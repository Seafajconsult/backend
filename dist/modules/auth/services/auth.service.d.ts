import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "@modules/user/services/user.service";
import { OtpService } from "./otp.service";
import { EmailService } from "./email.service";
import { CreateUserDto } from "@modules/user/dtos/create-user.dto";
import { LoginDto } from "@modules/user/dtos/login.dto";
import { IUserResponse } from "@modules/user/interfaces/user.interface";
interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly otpService;
    private readonly emailService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, otpService: OtpService, emailService: EmailService);
    private generateUserId;
    private generateTokens;
    register(createUserDto: CreateUserDto): Promise<{
        userId: string;
    }>;
    verifyEmail(userId: string, otp: string): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        user: IUserResponse;
        tokens: IAuthTokens;
    }>;
    refreshToken(refreshToken: string): Promise<IAuthTokens>;
    initiatePasswordReset(email: string): Promise<void>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<void>;
    inviteAdmin(email: string): Promise<void>;
}
export {};
