import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./email.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [ConfigModule, UserModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
