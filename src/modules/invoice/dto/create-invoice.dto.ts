import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional, ValidateNested, IsArray, IsEmail } from "class-validator";
import { Type } from "class-transformer";
import { InvoiceType } from "../invoice.schema";

class BillToDto {
  @ApiProperty({ description: "Billing name", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Billing email", example: "john@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Billing address", required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: "Billing phone", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: "Company name", required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ description: "Tax ID", required: false })
  @IsString()
  @IsOptional()
  taxId?: string;
}

class LineItemDto {
  @ApiProperty({ description: "Item description", example: "Application processing fee" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Quantity", example: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: "Unit price", example: 100.00 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ description: "Total price", example: 100.00 })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: "Tax rate percentage", required: false, example: 10 })
  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @ApiProperty({ description: "Tax amount", required: false, example: 10.00 })
  @IsNumber()
  @IsOptional()
  taxAmount?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: "User ID (student or employer)" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: "Invoice type", enum: InvoiceType, example: InvoiceType.APPLICATION_FEE })
  @IsEnum(InvoiceType)
  invoiceType: InvoiceType;

  @ApiProperty({ description: "Due date", example: "2024-02-01T00:00:00.000Z" })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ description: "Billing information", type: BillToDto })
  @ValidateNested()
  @Type(() => BillToDto)
  billTo: BillToDto;

  @ApiProperty({ description: "Line items", type: [LineItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems: LineItemDto[];

  @ApiProperty({ description: "Subtotal amount", example: 100.00 })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ description: "Tax amount", required: false, example: 10.00 })
  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @ApiProperty({ description: "Discount amount", required: false, example: 5.00 })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ description: "Total amount", example: 105.00 })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: "Currency", example: "USD" })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: "Additional notes", required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: "Payment terms", required: false })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiProperty({ description: "Related application ID", required: false })
  @IsString()
  @IsOptional()
  applicationId?: string;

  @ApiProperty({ description: "Related recruitment request ID", required: false })
  @IsString()
  @IsOptional()
  recruitmentRequestId?: string;

  @ApiProperty({ description: "Related job ID", required: false })
  @IsString()
  @IsOptional()
  jobId?: string;
}

export class UpdateInvoiceStatusDto {
  @ApiProperty({ description: "New invoice status", example: "paid" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: "Payment date", required: false })
  @IsDateString()
  @IsOptional()
  paidDate?: string;
}

export class RecordPaymentDto {
  @ApiProperty({ description: "Payment amount", example: 105.00 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: "Payment method", example: "credit_card" })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: "Transaction ID", example: "txn_123456789" })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: "Payment date", example: "2024-01-15T10:00:00.000Z" })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;
}
