import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [SuperAdminController],
})
export class SuperAdminModule {}
