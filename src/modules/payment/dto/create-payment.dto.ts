import { IsNotEmpty, IsNumber, IsEnum, IsString, IsOptional, IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "../payment.schema";

export class CreatePaymentDto {
  @ApiProperty({
    description: "Amount to be paid",
    example: 5000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: PaymentType,
    description: "Type of payment",
    example: PaymentType.APPLICATION_FEE,
  })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({
    description: "Currency code",
    example: "NGN",
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: "Description of the payment",
    example: "Application fee for University of Oxford",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "ID of the related application",
    example: "60d21b4667d0d8992e610c85",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  applicationId?: string;

  @ApiProperty({
    description: "Payment method",
    example: "card",
    enum: ["card", "bank_transfer", "ussd"],
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    description: "Client payment reference",
    example: "REF123456",
    required: false,
  })
  @IsOptional()
  @IsString()
  clientReference?: string;

  @ApiProperty({
    description: "Additional payment metadata",
    example: {
      customerEmail: "student@example.com",
      customerPhone: "+2341234567890"
    },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
