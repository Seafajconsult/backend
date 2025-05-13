import { Document } from "mongoose";
export interface IUser extends Document {
    readonly userId: string;
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;
    readonly isVerified: boolean;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    STUDENT = "student",
    EMPLOYER = "employer"
}
export interface IUserResponse {
    userId: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
