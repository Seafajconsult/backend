import { Document } from "mongoose";
export interface IOtp extends Document {
    email: string;
    otp: string;
    purpose: "registration" | "password-reset";
    expiry: Date;
    createdAt: Date;
}
export declare class Otp {
    email: string;
    otp: string;
    purpose: string;
    expiry: Date;
    createdAt: Date;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, Document<unknown, any, Otp, any> & Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, import("mongoose").FlatRecord<Otp>, {}> & import("mongoose").FlatRecord<Otp> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
