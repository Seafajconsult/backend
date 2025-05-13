import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User } from "../schemas/user.schema";
import { CreateUserDto } from "../dtos/create-user.dto";
import { IUser, IUserResponse } from "../interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { email, password, role } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role,
    });
    return user.toJSON();
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findById(userId: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isVerified: true });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }
}
