import { Model } from "mongoose";
import { Payment, PaymentType } from "./payment.schema";
import { ConfigService } from "@nestjs/config";
export declare class PaymentService {
    private paymentModel;
    private configService;
    constructor(paymentModel: Model<Payment>, configService: ConfigService);
    createPayment(paymentData: {
        userId: string;
        amount: number;
        paymentType: PaymentType;
        description?: string;
        metadata?: Record<string, any>;
    }): Promise<import("mongoose").Document<unknown, {}, Payment, {}> & Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    private simulatePaymentProcessing;
    getUserPayments(userId: string): Promise<(import("mongoose").Document<unknown, {}, Payment, {}> & Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getPaymentById(paymentId: string): Promise<import("mongoose").Document<unknown, {}, Payment, {}> & Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    refundPayment(paymentId: string): Promise<import("mongoose").Document<unknown, {}, Payment, {}> & Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Payment, {}> & Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findById(paymentId: string): Promise<import("mongoose").Document<unknown, {}, Payment, {}> & Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
