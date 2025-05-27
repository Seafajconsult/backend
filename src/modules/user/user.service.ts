import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserRole } from "./user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async generateUniqueUserId(): Promise<string> {
    while (true) {
      const userId = Math.floor(
        100000000 + Math.random() * 900000000,
      ).toString();
      const existingUser = await this.userModel.findOne({ userId });
      if (!existingUser) {
        return userId;
      }
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).exec();
  }

  private generateReferralCode(): string {
    // Generate an 8-character referral code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    return this.userModel.findOne({ referralCode }).exec();
  }

  async create(userData: {
    email: string;
    password: string;
    userId: string;
    role?: UserRole;
    isEmailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    referralCode?: string;
  }): Promise<User> {
    let referralCode = userData.referralCode;
    if (referralCode) {
      const referrer = await this.findByReferralCode(referralCode);
      if (!referrer) {
        throw new BadRequestException('Invalid referral code');
      }
    }

    const newUser = new this.userModel({
      ...userData,
      referralCode: this.generateReferralCode(), // Generate unique referral code for new user
    });

    const savedUser = await newUser.save();

    // If user was referred, update referrer's referrals
    if (referralCode) {
      const referrer = await this.findByReferralCode(referralCode);
      if (referrer) {
        await this.userModel.findByIdAndUpdate(
          referrer._id,
          { $push: { referrals: savedUser._id } },
          { new: true },
        );
        // Update the referred user with referrer info
        await this.userModel.findByIdAndUpdate(
          savedUser._id,
          { referredBy: referrer._id },
          { new: true },
        );
      }
    }

    return savedUser;
  }

  async markEmailAsVerified(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.isEmailVerified = true;
    return user.save();
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.password = newPassword;
    return user.save();
  }

  async findAll(role?: UserRole): Promise<User[]> {
    const query = role ? { role } : {};
    return this.userModel.find(query).exec();
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userModel.find({ role }).exec();
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.userModel.countDocuments({ role }).exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  async delete(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.userModel.findOneAndDelete({ userId }).exec();
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    referredUsers: User[];
    referredBy?: User;
  }> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [referredUsers, referredBy] = await Promise.all([
      this.userModel.find({ referredBy: user._id }).select('-password').exec(),
      user.referredBy ? this.userModel.findById(user.referredBy).select('-password').exec() : null,
    ]);

    return {
      totalReferrals: referredUsers.length,
      referredUsers,
      referredBy,
    };
  }

  async validateToken(token: string): Promise<User> {
    // Implement token validation logic here
    // This might involve decoding the JWT token and validating the user
    throw new Error('Method not implemented');
  }
}
