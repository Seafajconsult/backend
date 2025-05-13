import { Payment } from "../../modules/payment/payment.schema";
import { ConfigService } from "@nestjs/config";
export declare class PdfService {
    private configService;
    constructor(configService: ConfigService);
    generateInvoice(payment: Payment, user: any): Promise<{
        url: string;
        publicId: string;
    }>;
    private generateInvoiceContent;
}
