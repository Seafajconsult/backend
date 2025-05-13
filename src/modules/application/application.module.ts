import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Application, ApplicationSchema } from "./application.schema";
import { ApplicationService } from "./application.service";
import { ApplicationController } from "./application.controller";
import { UserModule } from "../user/user.module";
import { DocumentModule } from "../document/document.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    UserModule,
    DocumentModule,
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
