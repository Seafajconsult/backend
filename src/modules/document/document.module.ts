import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserDocument, UserDocumentSchema } from "./document.schema";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { CloudinaryService } from "../../shared/services/cloudinary.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserDocumentSchema },
    ]),
  ],
  providers: [DocumentService, CloudinaryService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
