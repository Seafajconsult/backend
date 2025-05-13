import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { DocumentModule } from '../document/document.module';
import { PaymentModule } from '../payment/payment.module';
import { MessageModule } from '../message/message.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DocumentModule,
    PaymentModule,
    MessageModule,
    ApplicationModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
