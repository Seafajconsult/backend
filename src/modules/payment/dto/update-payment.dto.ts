import { IsOptional, IsEnum, IsString, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "../payment.schema";

export class UpdatePaymentDto {
  @ApiProperty({
    enum: PaymentStatus,
    description: "Status of the payment",
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({
    description: "Transaction ID from payment provider",
    example: "txn_1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    description: "Payment method used",
    example: "credit_card",
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    description: "Additional metadata for the payment",
    example: { gateway: "paystack", reference: "ref_123456" },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
