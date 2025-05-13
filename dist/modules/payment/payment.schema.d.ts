import { Document } from "mongoose";
import * as mongoose from "mongoose";
export declare enum PaymentType {
    APPLICATION_FEE = "application_fee",
    SERVICE_CHARGE = "service_charge",
    CONSULTATION_FEE = "consultation_fee"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Payment extends Document {
    userId: string;
    amount: number;
    currency: string;
    paymentType: PaymentType;
    status: PaymentStatus;
    transactionId?: string;
    paymentMethod?: string;
    description?: string;
    metadata?: Record<string, any>;
}
export declare const PaymentSchema: mongoose.Schema<Payment, mongoose.Model<Payment, any, any, any, Document<unknown, any, Payment, any> & Payment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Payment, Document<unknown, {}, mongoose.FlatRecord<Payment>, {}> & mongoose.FlatRecord<Payment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
