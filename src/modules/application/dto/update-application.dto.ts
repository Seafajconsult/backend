import { IsOptional, IsString, IsEnum, IsDate, IsNumber, IsArray, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ApplicationStatus } from "../application.schema";

class OfferDetailsDto {
  @ApiProperty({
    description: "Offered salary",
    example: 50000,
  })
  @IsNumber()
  salary: number;

  @ApiProperty({
    description: "Job start date",
    example: "2023-09-01",
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: "Benefits offered",
    example: ["Health insurance", "401k", "Remote work"],
  })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];
}

export class UpdateApplicationDto {
  @ApiProperty({
    description: "Position being applied for",
    example: "Software Engineer Intern",
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    enum: ApplicationStatus,
    description: "Current status of the application",
    required: false,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({
    description: "Interview date",
    example: "2023-08-15T14:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  interviewDate?: Date;

  @ApiProperty({
    description: "Notes from the interview",
    example: "Candidate showed strong problem-solving skills",
    required: false,
  })
  @IsOptional()
  @IsString()
  interviewNotes?: string;

  @ApiProperty({
    description: "Details of the job offer",
    required: false,
    type: OfferDetailsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OfferDetailsDto)
  offerDetails?: OfferDetailsDto;
}
