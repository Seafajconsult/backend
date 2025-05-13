import { PaymentType } from "../payment.schema";
export declare class CreatePaymentDto {
    amount: number;
    paymentType: PaymentType;
    currency?: string;
    description?: string;
    applicationId?: string;
}
