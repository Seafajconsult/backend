import { Document } from "mongoose";
export declare enum UserRole {
    STUDENT = "student",
    EMPLOYER = "employer",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User extends Document {
    userId: string;
    email: string;
    password: string;
    role: UserRole;
    isEmailVerified: boolean;
    isActive: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
