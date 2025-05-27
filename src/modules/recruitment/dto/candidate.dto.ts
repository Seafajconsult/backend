import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsEmail } from "class-validator";
import { Type } from "class-transformer";

class CandidateProfileDto {
  @ApiProperty({ description: "First name", example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: "Last name", example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: "Email", example: "john.doe@email.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Phone number", example: "+1234567890" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: "Work experience summary", example: "5 years in software development" })
  @IsString()
  @IsNotEmpty()
  experience: string;

  @ApiProperty({ description: "Education background", example: "Bachelor's in Computer Science" })
  @IsString()
  @IsNotEmpty()
  education: string;

  @ApiProperty({ description: "Skills", type: [String], example: ["JavaScript", "Node.js", "React"] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({ description: "Current position", required: false })
  @IsString()
  @IsOptional()
  currentPosition?: string;

  @ApiProperty({ description: "Current company", required: false })
  @IsString()
  @IsOptional()
  currentCompany?: string;

  @ApiProperty({ description: "Expected salary", required: false })
  @IsNumber()
  @IsOptional()
  expectedSalary?: number;

  @ApiProperty({ description: "Notice period", required: false })
  @IsString()
  @IsOptional()
  noticePeriod?: string;
}

export class AddCandidateDto {
  @ApiProperty({ description: "Candidate user ID (if existing user)" })
  @IsString()
  @IsNotEmpty()
  candidateId: string;

  @ApiProperty({ description: "Candidate profile information", type: CandidateProfileDto })
  @ValidateNested()
  @Type(() => CandidateProfileDto)
  candidateProfile: CandidateProfileDto;

  @ApiProperty({ description: "Document IDs", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents?: string[];
}

export class UpdateCandidateStatusDto {
  @ApiProperty({ description: "New candidate status", example: "shortlisted" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: "Status update note", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class ScheduleCandidateInterviewDto {
  @ApiProperty({ description: "Interview date and time", example: "2024-01-15T10:00:00.000Z" })
  @IsString()
  @IsNotEmpty()
  scheduledDate: string;

  @ApiProperty({ description: "Interview type", example: "video" })
  @IsString()
  @IsNotEmpty()
  interviewType: string;

  @ApiProperty({ description: "Additional notes", required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CandidateInterviewFeedbackDto {
  @ApiProperty({ description: "Interview feedback", example: "Excellent technical skills" })
  @IsString()
  @IsNotEmpty()
  feedback: string;

  @ApiProperty({ description: "Rating out of 10", example: 8 })
  @IsNumber()
  rating: number;

  @ApiProperty({ description: "Interviewer notes", required: false })
  @IsString()
  @IsOptional()
  interviewerNotes?: string;
}
