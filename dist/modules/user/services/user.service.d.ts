import { Model } from "mongoose";
import { CreateUserDto } from "../dtos/create-user.dto";
import { IUser, IUserResponse } from "../interfaces/user.interface";
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<IUser>);
    createUser(createUserDto: CreateUserDto): Promise<IUserResponse>;
    findByEmail(email: string): Promise<IUser>;
    findById(userId: string): Promise<IUser>;
    verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    markEmailAsVerified(userId: string): Promise<void>;
    updatePassword(userId: string, newPassword: string): Promise<void>;
}
