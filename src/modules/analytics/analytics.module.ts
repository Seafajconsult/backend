import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { Analytics, AnalyticsSchema } from "./analytics.schema";
import { Application, ApplicationSchema } from "../application/application.schema";
import { Payment, PaymentSchema } from "../payment/payment.schema";
import { Message, MessageSchema } from "../message/message.schema";
import { UserDocument, UserDocumentSchema } from "../document/document.schema";
import { User, UserSchema } from "../user/user.schema";
import { Job, JobSchema, JobApplication, JobApplicationSchema } from "../job/job.schema";
import { RecruitmentRequest, RecruitmentRequestSchema, RecruitmentCandidate, RecruitmentCandidateSchema } from "../recruitment/recruitment.schema";
import { Invoice, InvoiceSchema } from "../invoice/invoice.schema";
import { Referral, ReferralSchema, ReferralReward, ReferralRewardSchema } from "../referral/referral.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytics.name, schema: AnalyticsSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Message.name, schema: MessageSchema },
      { name: UserDocument.name, schema: UserDocumentSchema },
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: RecruitmentRequest.name, schema: RecruitmentRequestSchema },
      { name: RecruitmentCandidate.name, schema: RecruitmentCandidateSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Referral.name, schema: ReferralSchema },
      { name: ReferralReward.name, schema: ReferralRewardSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
