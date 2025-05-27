import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { User, UserSchema } from "./schemas/user.schema";
import { UserService } from "./services/user.service";
import { ReferralService } from "./services/referral.service";
import { ReferralController } from "./controllers/referral.controller";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
    ConfigModule,
  ],
  providers: [UserService, ReferralService],
  controllers: [ReferralController],
  exports: [UserService, ReferralService],
})
export class UserModule {}
