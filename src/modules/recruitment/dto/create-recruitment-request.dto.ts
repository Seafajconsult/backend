import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { RecruitmentServiceType, EmploymentType } from "../recruitment.schema";

class BudgetRangeDto {
  @ApiProperty({ description: "Minimum budget", example: 50000 })
  @IsNumber()
  min: number;

  @ApiProperty({ description: "Maximum budget", example: 80000 })
  @IsNumber()
  max: number;

  @ApiProperty({ description: "Currency", example: "USD" })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

class ServiceDetailsDto {
  @ApiProperty({ description: "Service duration", required: false, example: "6 months" })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ description: "Service features", type: [String], example: ["Candidate sourcing", "Interview coordination"] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ 
    description: "Pricing information",
    example: { amount: 5000, currency: "USD", billingCycle: "monthly" }
  })
  @ValidateNested()
  @Type(() => Object)
  pricing: {
    amount: number;
    currency: string;
    billingCycle?: string;
  };
}

export class CreateRecruitmentRequestDto {
  @ApiProperty({ 
    description: "Type of recruitment service", 
    enum: RecruitmentServiceType, 
    example: RecruitmentServiceType.PRN_PROGRAM 
  })
  @IsEnum(RecruitmentServiceType)
  serviceType: RecruitmentServiceType;

  @ApiProperty({ description: "Job title", example: "Senior Software Developer" })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ description: "Job description", example: "We are looking for a skilled software developer..." })
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @ApiProperty({ description: "Number of positions to fill", example: 2 })
  @IsNumber()
  numberOfPositions: number;

  @ApiProperty({ 
    description: "Employment type", 
    enum: EmploymentType, 
    example: EmploymentType.FULL_TIME 
  })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty({ description: "Preferred start date", example: "2024-02-01T00:00:00.000Z" })
  @IsDateString()
  preferredStartDate: string;

  @ApiProperty({ description: "Budget range", type: BudgetRangeDto })
  @ValidateNested()
  @Type(() => BudgetRangeDto)
  budgetRange: BudgetRangeDto;

  @ApiProperty({ description: "Additional requirements", required: false })
  @IsString()
  @IsOptional()
  additionalRequirements?: string;

  @ApiProperty({ description: "Service details", type: ServiceDetailsDto })
  @ValidateNested()
  @Type(() => ServiceDetailsDto)
  serviceDetails: ServiceDetailsDto;
}

export class UpdateRecruitmentStatusDto {
  @ApiProperty({ description: "New recruitment status", example: "in_progress" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: "Status update note", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class AssignRecruiterDto {
  @ApiProperty({ description: "Recruiter user ID" })
  @IsString()
  @IsNotEmpty()
  recruiterId: string;

  @ApiProperty({ description: "Manager user ID", required: false })
  @IsString()
  @IsOptional()
  managerId?: string;
}
