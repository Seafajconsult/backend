import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RecruitmentController } from "./recruitment.controller";
import { RecruitmentService } from "./recruitment.service";
import { RecruitmentRequest, RecruitmentRequestSchema, RecruitmentCandidate, RecruitmentCandidateSchema } from "./recruitment.schema";
import { NotificationModule } from "../notification/notification.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecruitmentRequest.name, schema: RecruitmentRequestSchema },
      { name: RecruitmentCandidate.name, schema: RecruitmentCandidateSchema },
    ]),
    NotificationModule,
    UserModule,
  ],
  providers: [RecruitmentService],
  controllers: [RecruitmentController],
  exports: [RecruitmentService],
})
export class RecruitmentModule {}
