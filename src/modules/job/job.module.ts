import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { Job, JobSchema, JobApplication, JobApplicationSchema } from "./job.schema";
import { NotificationModule } from "../notification/notification.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
    ]),
    NotificationModule,
    UserModule,
  ],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
