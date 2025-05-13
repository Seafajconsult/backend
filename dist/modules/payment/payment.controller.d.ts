import { PaymentService } from "./payment.service";
import { PaymentType } from "./payment.schema";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(paymentData: {
        userId: string;
        amount: number;
        paymentType: PaymentType;
        description?: string;
        metadata?: Record<string, any>;
    }): Promise<import("mongoose").Document<unknown, {}, import("./payment.schema").Payment, {}> & import("./payment.schema").Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserPayments(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./payment.schema").Payment, {}> & import("./payment.schema").Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    refundPayment(paymentId: string): Promise<import("mongoose").Document<unknown, {}, import("./payment.schema").Payment, {}> & import("./payment.schema").Payment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
