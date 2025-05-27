import { IsString, IsDate, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '../application.schema';

export class StatusHistoryDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  status: string;

  @IsString()
  note: string;
}

export class OfferDetailsDto {
  @IsString()
  offerLetterUrl: string;

  @IsString()
  tuitionFee: number;

  @IsOptional()
  scholarship?: number;

  @IsDate()
  @Type(() => Date)
  acceptanceDeadline: Date;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  programDuration: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalRequirements?: string[];
}

export class CreateApplicationDto {
  @IsString()
  studentId: string;

  @IsString()
  employerId: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  interviewDate?: Date;

  @IsOptional()
  @IsString()
  interviewNotes?: string;

  @IsOptional()
  offerDetails?: OfferDetailsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}
