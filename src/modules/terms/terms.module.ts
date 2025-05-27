import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TermsController } from "./terms.controller";
import { TermsService } from "./terms.service";
import { Terms, TermsSchema, TermsAcceptance, TermsAcceptanceSchema } from "./terms.schema";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Terms.name, schema: TermsSchema },
      { name: TermsAcceptance.name, schema: TermsAcceptanceSchema },
    ]),
    NotificationModule,
  ],
  providers: [TermsService],
  controllers: [TermsController],
  exports: [TermsService],
})
export class TermsModule {}
