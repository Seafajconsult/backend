import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UserService } from "../user/user.service";
import { OTPService } from "../otp/otp.service";
import { NotificationService } from "../notification/notification.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "../user/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OTPService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    const userId = await this.userService.generateUniqueUserId();
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with unverified email
    const user = await this.userService.create({
      ...registerDto,
      userId,
      password: hashedPassword,
      isEmailVerified: false,
    });

    // Generate and send OTP
    const otp = await this.otpService.generateOTP(registerDto.email);
    // TODO: Implement email service to send OTP

    // Notify super admins about the new user registration
    await this.notificationService.notifyNewUserRegistration(
      userId,
      registerDto.email,
      registerDto.role || UserRole.STUDENT
    );

    return {
      userId,
      message:
        "Registration successful. Please verify your email with the OTP sent.",
    };
  }

  async verifyEmail(userId: string, otp: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const isValid = await this.otpService.verifyOTP(user.email, otp);
    if (!isValid) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    // Mark email as verified
    await this.userService.markEmailAsVerified(userId);

    return { message: "Email verified successfully" };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !user.isEmailVerified) {
      throw new UnauthorizedException(
        "Invalid credentials or unverified email",
      );
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
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

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return {
        access_token: await this.generateAccessToken(user),
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async inviteAdmin(email: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    const userId = await this.userService.generateUniqueUserId();
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    await this.userService.create({
      email,
      password: hashedPassword,
      userId,
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });

    // TODO: Send invitation email with temporary password
    return { message: "Admin invitation sent successfully" };
  }

  private async generateAccessToken(user: any) {
    const payload = { sub: user.userId, email: user.email, role: user.role };
    return this.jwtService.sign(payload, { expiresIn: "15m" });
  }

  private async generateRefreshToken(user: any) {
    const payload = { sub: user.userId };
    return this.jwtService.sign(payload, { expiresIn: "7d" });
  }
}
