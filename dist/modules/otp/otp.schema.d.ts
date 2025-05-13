import { Document } from "mongoose";
export declare class OTP extends Document {
    email: string;
    code: string;
    expiresAt: Date;
}
export declare const OTPSchema: import("mongoose").Schema<OTP, import("mongoose").Model<OTP, any, any, any, Document<unknown, any, OTP, any> & OTP & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OTP, Document<unknown, {}, import("mongoose").FlatRecord<OTP>, {}> & import("mongoose").FlatRecord<OTP> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
