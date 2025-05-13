import { IsNotEmpty, IsEnum, IsArray, IsMongoId, IsOptional, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ConversationType } from "../conversation.schema";

export class CreateConversationDto {
  @ApiProperty({
    description: "Array of participant user IDs",
    example: ["60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86"],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  participants: string[];

  @ApiProperty({
    enum: ConversationType,
    description: "Type of conversation",
    example: ConversationType.STUDENT_ADVISOR,
  })
  @IsNotEmpty()
  @IsEnum(ConversationType)
  type: ConversationType;

  @ApiProperty({
    description: "Additional metadata for the conversation",
    example: { topic: "University application assistance" },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
