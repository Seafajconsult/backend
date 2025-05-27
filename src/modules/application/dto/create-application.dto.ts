import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDate, IsArray, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '../application.schema';

class AcademicDetailsDto {
  @ApiProperty({ example: 'Bachelor of Science' })
  @IsString()
  highestQualification: string;

  @ApiProperty({ example: 'University of Lagos' })
  @IsString()
  institution: string;

  @ApiProperty({ example: 2024 })
  @IsNumber()
  graduationYear: number;

  @ApiProperty({ example: 3.8 })
  @IsNumber()
  cgpa: number;

  @ApiProperty({
    example: {
      type: 'IELTS',
      score: 7.5,
      dateOfTest: '2024-12-01'
    },
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnglishTestDto)
  englishTest?: EnglishTestDto;
}

class EnglishTestDto {
  @ApiProperty({ example: 'IELTS' })
  @IsString()
  type: string;

  @ApiProperty({ example: 7.5 })
  @IsNumber()
  score: number;

  @ApiProperty({ example: '2024-12-01' })
  @Type(() => Date)
  @IsDate()
  dateOfTest: Date;
}

export class CreateApplicationDto {
  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  course: string;

  @ApiProperty({ example: 'University of Oxford' })
  @IsString()
  university: string;

  @ApiProperty({ example: 'United Kingdom' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Fall 2025' })
  @IsString()
  intake: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AcademicDetailsDto)
  academicDetails: AcademicDetailsDto;

  @ApiProperty({ 
    type: [String],
    example: ['60d21b4667d0d8992e610c85'],
    required: false
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  documents?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  additionalInformation?: string;
}
