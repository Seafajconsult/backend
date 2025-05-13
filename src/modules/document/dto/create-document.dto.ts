import { IsEnum, IsNotEmpty } from "class-validator";
import { DocumentType } from "../document.schema";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    description: "Type of document being uploaded",
  })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType;
}
