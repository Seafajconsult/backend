import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MessageModule,
    ApplicationModule,
  ],
  controllers: [EmployerController],
  providers: [],
})
export class EmployerModule {}
