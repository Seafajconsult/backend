import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "@modules/user/services/user.service";
import { OtpService } from "./otp.service";
import { EmailService } from "./email.service";
import { CreateUserDto } from "@modules/user/dtos/create-user.dto";
import { LoginDto } from "@modules/user/dtos/login.dto";
import { IUser, IUserResponse } from "@modules/user/interfaces/user.interface";

interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  private generateUserId(): string {
    // Generate a 9-digit unique ID
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  }

  private async generateTokens(user: IUser): Promise<IAuthTokens> {
    const payload = { sub: user._id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { ...payload, tokenType: "refresh" },
        {
          secret: this.configService.get("app.jwt.refreshSecret"),
          expiresIn: `${this.configService.get("app.jwt.refreshExpiration")}s`,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto): Promise<{ userId: string }> {
    // Generate a unique user ID
    this.generateUserId(); // Generate but not used directly as the service handles it
    // Create user with the generated userId
    const user = await this.userService.createUser(createUserDto);
    await this.otpService.sendOtp(user.email, "registration");
    // Return the user ID from the created user
    return { userId: user.userId };
  }

  async verifyEmail(userId: string, otp: string): Promise<void> {
    const user = await this.userService.findById(userId);
    const isValid = await this.otpService.verifyOtp(user.email, otp, "registration");
    if (!isValid) {
      throw new BadRequestException("Invalid OTP");
    }
    await this.userService.markEmailAsVerified(user._id as string);
    await this.emailService.sendWelcomeEmail(
      user.email,
      user.email.split("@")[0],
    );
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user.isVerified) {
      throw new UnauthorizedException("Please verify your email first");
    }
    const isPasswordValid = await this.userService.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const tokens = await this.generateTokens(user);
    const userResponse: IUserResponse = {
      userId: user._id as string,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    return { user: userResponse, tokens };
  }

  async refreshToken(refreshToken: string): Promise<IAuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get("app.jwt.refreshSecret"),
      });
      const user = await this.userService.findById(payload.sub);
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async initiatePasswordReset(email: string): Promise<void> {
    // Check if user exists but don't throw error if not (security best practice)
    await this.userService.findByEmail(email);
    // Send OTP regardless of whether user exists (prevents email enumeration)
    await this.otpService.sendOtp(email, "password-reset");
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userService.findByEmail(email);
    const isValid = await this.otpService.verifyOtp(email, otp, "password-reset");
    if (!isValid) {
      throw new BadRequestException("Invalid OTP");
    }
    await this.userService.updatePassword(user._id as string, newPassword);
  }

  async inviteAdmin(email: string): Promise<void> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    // Generate admin invitation token
    const payload = { email, role: "admin", type: "invitation" };
    const invitationToken = await this.jwtService.signAsync(payload, {
      expiresIn: "24h",
      secret: this.configService.get("app.jwt.invitationSecret"),
    });

    // Send invitation email
    await this.emailService.sendAdminInvitation(email, invitationToken);
  }
}
