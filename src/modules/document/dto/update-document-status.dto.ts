import { IsEnum, IsOptional, IsString } from "class-validator";
import { DocumentStatus } from "../document.schema";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDocumentStatusDto {
  @ApiProperty({
    enum: DocumentStatus,
    description: "New status for the document",
  })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @ApiProperty({
    description: "Reason for rejection (required if status is REJECTED)",
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
