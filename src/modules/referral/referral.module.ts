import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReferralController } from "./referral.controller";
import { ReferralService } from "./referral.service";
import { 
  Referral, 
  ReferralSchema, 
  ReferralReward, 
  ReferralRewardSchema, 
  ReferralProgram, 
  ReferralProgramSchema 
} from "./referral.schema";
import { NotificationModule } from "../notification/notification.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referral.name, schema: ReferralSchema },
      { name: ReferralReward.name, schema: ReferralRewardSchema },
      { name: ReferralProgram.name, schema: ReferralProgramSchema },
    ]),
    NotificationModule,
    UserModule,
  ],
  providers: [ReferralService],
  controllers: [ReferralController],
  exports: [ReferralService],
})
export class ReferralModule {}
