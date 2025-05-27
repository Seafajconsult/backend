import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OTPModule } from "./modules/otp/otp.module";
import { DocumentModule } from "./modules/document/document.module";
import { ApplicationModule } from "./modules/application/application.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { MessageModule } from "./modules/message/message.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { EmailModule } from "./modules/email/email.module";
import { SharedModule } from "./shared/shared.module";
import { StudentModule } from "./modules/student/student.module";
import { EmployerModule } from "./modules/employer/employer.module";
import { AdminModule } from "./modules/admin/admin.module";
import { SuperAdminModule } from "./modules/super-admin/super-admin.module";
import { JobModule } from "./modules/job/job.module";
import { RecruitmentModule } from "./modules/recruitment/recruitment.module";
import { InvoiceModule } from "./modules/invoice/invoice.module";
import { ReferralModule } from "./modules/referral/referral.module";
import { TermsModule } from "./modules/terms/terms.module";
import { SMSModule } from "./modules/sms/sms.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => import('./config/configuration').then(m => m.default())],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: process.env.DATABASE_URI || config.get("database.uri"),
      }),
    }),
    SharedModule,
    UserModule,
    AuthModule,
    OTPModule,
    EmailModule,
    DocumentModule,
    ApplicationModule,
    PaymentModule,
    MessageModule,
    NotificationModule,
    StudentModule,
    EmployerModule,
    AdminModule,
    SuperAdminModule,
    JobModule,
    RecruitmentModule,
    InvoiceModule,
    ReferralModule,
    TermsModule,
    SMSModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
