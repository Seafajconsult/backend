import { Injectable, NotFoundException } from "@nestjs/common";
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

  async create(userData: {
    email: string;
    password: string;
    userId: string;
    role?: UserRole;
    isEmailVerified?: boolean;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
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
}
