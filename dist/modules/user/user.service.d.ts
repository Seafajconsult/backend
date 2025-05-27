import { Model } from "mongoose";
import { User, UserRole } from "./user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    generateUniqueUserId(): Promise<string>;
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    private generateReferralCode;
    findByReferralCode(referralCode: string): Promise<User | null>;
    create(userData: {
        email: string;
        password: string;
        userId: string;
        role?: UserRole;
        isEmailVerified?: boolean;
        firstName?: string;
        lastName?: string;
        referralCode?: string;
    }): Promise<User>;
    markEmailAsVerified(userId: string): Promise<User>;
    updatePassword(userId: string, newPassword: string): Promise<User>;
    findAll(role?: UserRole): Promise<User[]>;
    findByRole(role: UserRole): Promise<User[]>;
    count(): Promise<number>;
    countByRole(role: UserRole): Promise<number>;
    update(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(userId: string): Promise<User>;
    getReferralStats(userId: string): Promise<{
        totalReferrals: number;
        referredUsers: User[];
        referredBy?: User;
    }>;
}
