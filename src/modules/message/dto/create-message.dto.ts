import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject, IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MessageType } from "../message.schema";

export class CreateMessageDto {
  @ApiProperty({
    description: "ID of the conversation",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  conversationId: string;

  @ApiProperty({
    description: "Content of the message",
    example: "Hello, how can I help you with your application?",
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    enum: MessageType,
    description: "Type of message",
    example: MessageType.TEXT,
    required: false,
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiProperty({
    description: "Additional metadata for the message",
    example: { attachmentUrl: "https://example.com/file.pdf" },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
