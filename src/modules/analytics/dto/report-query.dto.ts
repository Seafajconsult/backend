import { IsEnum, IsOptional, IsDateString, IsArray } from "class-validator";

export enum ReportType {
  APPLICATION_METRICS = "application_metrics",
  REVENUE_ANALYSIS = "revenue_analysis",
  USER_ENGAGEMENT = "user_engagement",
  DOCUMENT_VERIFICATION = "document_verification",
}

export enum ReportFormat {
  JSON = "json",
  CSV = "csv",
  PDF = "pdf",
}

export class ReportQueryDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsArray()
  @IsOptional()
  metrics?: string[];
}
