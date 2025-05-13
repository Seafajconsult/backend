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
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: "Description of the payment",
    example: "Application fee for university admission",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "ID of the related application",
    example: "60d21b4667d0d8992e610c85",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  applicationId?: string;
}
