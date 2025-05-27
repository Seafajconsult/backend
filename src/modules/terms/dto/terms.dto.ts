import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsDateString, IsOptional, IsArray } from "class-validator";
import { TermsType } from "../terms.schema";

export class CreateTermsDto {
  @ApiProperty({ description: "Terms title", example: "Terms of Service" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Terms version", example: "1.0" })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ description: "Terms type", enum: TermsType, example: TermsType.GENERAL })
  @IsEnum(TermsType)
  type: TermsType;

  @ApiProperty({ description: "Terms content (HTML)", example: "<h1>Terms of Service</h1><p>Content...</p>" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: "Effective date", example: "2024-01-01T00:00:00.000Z" })
  @IsDateString()
  effectiveDate: string;

  @ApiProperty({ description: "Expiry date", required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiProperty({ description: "Applicable user roles", type: [String], example: ["student", "employer"] })
  @IsArray()
  @IsString({ each: true })
  applicableRoles: string[];

  @ApiProperty({ description: "Is acceptance required", example: true })
  @IsBoolean()
  isRequired: boolean;
}

export class UpdateTermsDto {
  @ApiProperty({ description: "Terms title", required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: "Terms content (HTML)", required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: "Effective date", required: false })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @ApiProperty({ description: "Expiry date", required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiProperty({ description: "Applicable user roles", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableRoles?: string[];

  @ApiProperty({ description: "Is acceptance required", required: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}

export class AcceptTermsDto {
  @ApiProperty({ description: "Terms ID to accept" })
  @IsString()
  @IsNotEmpty()
  termsId: string;

  @ApiProperty({ description: "User IP address", example: "192.168.1.1" })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ description: "User agent string", example: "Mozilla/5.0..." })
  @IsString()
  @IsNotEmpty()
  userAgent: string;
}

export class WithdrawConsentDto {
  @ApiProperty({ description: "Reason for withdrawal", example: "No longer using the service" })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
