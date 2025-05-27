import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";
import { Invoice, InvoiceSchema, InvoiceTemplate, InvoiceTemplateSchema } from "./invoice.schema";
import { NotificationModule } from "../notification/notification.module";
import { SharedModule } from "../../shared/shared.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: InvoiceTemplate.name, schema: InvoiceTemplateSchema },
    ]),
    NotificationModule,
    SharedModule,
    EmailModule,
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}
