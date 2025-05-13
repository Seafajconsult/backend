import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { DocumentModule } from '../document/document.module';
import { PaymentModule } from '../payment/payment.module';
import { MessageModule } from '../message/message.module';
import { NotificationModule } from '../notification/notification.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DocumentModule,
    PaymentModule,
    MessageModule,
    NotificationModule,
    ApplicationModule,
  ],
  controllers: [StudentController],
})
export class StudentModule {}
