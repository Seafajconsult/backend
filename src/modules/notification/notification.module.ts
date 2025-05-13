import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Notification, NotificationSchema } from "./notification.schema";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { NotificationGateway } from "./notification.gateway";
import { EmailService } from "../email/email.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwt.expiration') || '15m',
        },
      }),
    }),
    UserModule,
  ],
  providers: [NotificationService, NotificationGateway, EmailService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
