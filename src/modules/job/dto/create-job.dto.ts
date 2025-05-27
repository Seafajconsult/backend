import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber, IsBoolean, IsDateString, ValidateNested, IsEmail } from "class-validator";
import { Type } from "class-transformer";
import { JobType, ExperienceLevel } from "../job.schema";

class SalaryDto {
  @ApiProperty({ description: "Minimum salary", example: 50000 })
  @IsNumber()
  min: number;

  @ApiProperty({ description: "Maximum salary", example: 80000 })
  @IsNumber()
  max: number;

  @ApiProperty({ description: "Currency", example: "USD" })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: "Is salary negotiable", example: true })
  @IsBoolean()
  @IsOptional()
  negotiable?: boolean;
}

class CompanyInfoDto {
  @ApiProperty({ description: "Company name", example: "Tech Corp" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Company logo URL", required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ description: "Company website", required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: "Industry", example: "Technology" })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ description: "Company size", example: "51-200" })
  @IsString()
  @IsNotEmpty()
  size: string;
}

class ContactInfoDto {
  @ApiProperty({ description: "Contact email", example: "hr@company.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Contact phone", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: "Contact person name", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;
}

export class CreateJobDto {
  @ApiProperty({ description: "Job title", example: "Senior Software Developer" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Job description", example: "We are looking for a skilled software developer..." })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Job requirements", example: "5+ years of experience, JavaScript, Node.js" })
  @IsString()
  @IsNotEmpty()
  requirements: string;

  @ApiProperty({ description: "Job location", example: "New York, NY" })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: "Job type", enum: JobType, example: JobType.FULL_TIME })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({ description: "Experience level", enum: ExperienceLevel, example: ExperienceLevel.MID_LEVEL })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty({ description: "Salary information", type: SalaryDto })
  @ValidateNested()
  @Type(() => SalaryDto)
  salary: SalaryDto;

  @ApiProperty({ description: "Required skills", type: [String], example: ["JavaScript", "Node.js", "React"] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ description: "Job benefits", type: [String], example: ["Health Insurance", "401k"] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @ApiProperty({ description: "Application deadline", example: "2024-12-31T23:59:59.999Z" })
  @IsDateString()
  applicationDeadline: string;

  @ApiProperty({ description: "Company information", type: CompanyInfoDto })
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  companyInfo: CompanyInfoDto;

  @ApiProperty({ description: "Contact information", type: ContactInfoDto })
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @ApiProperty({ description: "Job tags", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: "Is remote job", example: false })
  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;
}
