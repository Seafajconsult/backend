import { PaymentStatus } from "../payment.schema";
export declare class UpdatePaymentDto {
    status?: PaymentStatus;
    transactionId?: string;
    paymentMethod?: string;
    metadata?: Record<string, any>;
}
