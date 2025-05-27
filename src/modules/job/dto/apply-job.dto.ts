import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class ApplicantProfileDto {
  @ApiProperty({ description: "First name", example: "John" })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Last name", example: "Doe" })
  @IsString()
  lastName: string;

  @ApiProperty({ description: "Email", example: "john.doe@email.com" })
  @IsString()
  email: string;

  @ApiProperty({ description: "Phone number", example: "+1234567890" })
  @IsString()
  phone: string;

  @ApiProperty({ description: "Work experience summary", example: "5 years in software development" })
  @IsString()
  experience: string;

  @ApiProperty({ description: "Education background", example: "Bachelor's in Computer Science" })
  @IsString()
  education: string;

  @ApiProperty({ description: "Skills", type: [String], example: ["JavaScript", "Node.js", "React"] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}

export class ApplyJobDto {
  @ApiProperty({ description: "Cover letter", required: false })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiProperty({ description: "Resume URL", required: false })
  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @ApiProperty({ description: "Document IDs", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents?: string[];

  @ApiProperty({ description: "Applicant profile information", type: ApplicantProfileDto })
  @ValidateNested()
  @Type(() => ApplicantProfileDto)
  applicantProfile: ApplicantProfileDto;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ description: "New application status", example: "shortlisted" })
  @IsString()
  status: string;

  @ApiProperty({ description: "Status update note", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class ScheduleInterviewDto {
  @ApiProperty({ description: "Interview date and time", example: "2024-01-15T10:00:00.000Z" })
  @IsString()
  scheduledDate: string;

  @ApiProperty({ description: "Interview type", example: "video" })
  @IsString()
  interviewType: string;

  @ApiProperty({ description: "Meeting link for video interviews", required: false })
  @IsString()
  @IsOptional()
  meetingLink?: string;

  @ApiProperty({ description: "Interview location for in-person interviews", required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: "Additional notes", required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
