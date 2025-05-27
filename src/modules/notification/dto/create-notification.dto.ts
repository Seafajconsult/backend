import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject, IsBoolean, IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "../notification.schema";

export class CreateNotificationDto {
  @ApiProperty({
    description: "ID of the user to notify",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: "Title of the notification",
    example: "Document Approved",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Message content of the notification",
    example: "Your passport has been verified and approved.",
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    enum: NotificationType,
    description: "Type of notification",
    example: NotificationType.DOCUMENT_VERIFIED,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: "Link to redirect when notification is clicked",
    example: "/documents/123",
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    description: "Additional data related to the notification",
    example: { documentId: "123", status: "approved" },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({
    description: "Whether to send an email notification",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;
}
