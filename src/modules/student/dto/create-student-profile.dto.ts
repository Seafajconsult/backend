import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsDate, IsPhoneNumber, IsISO31661Alpha2 } from 'class-validator';
import { Type } from 'class-transformer';
import { StudentStatus } from '../../user/schemas/student-profile.schema';

export class CreateStudentProfileDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+2341234567890' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: '1995-05-15' })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ example: 'Nigerian' })
  @IsString()
  nationality: string;

  @ApiProperty({ example: '123 Main St, Lagos, Nigeria' })
  @IsString()
  currentAddress: string;

  @ApiProperty({ 
    enum: StudentStatus,
    example: StudentStatus.ACTIVE,
    default: StudentStatus.ACTIVE
  })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;

  @ApiProperty({ 
    example: ['UK', 'US', 'CA'],
    description: 'ISO 3166-1 alpha-2 country codes'
  })
  @IsArray()
  @IsISO31661Alpha2({ each: true })
  preferredCountries: string[];

  @ApiProperty({ 
    example: ['Computer Science', 'Software Engineering']
  })
  @IsArray()
  @IsString({ each: true })
  preferredCourses: string[];

  @ApiProperty({ example: 'Bachelor of Science' })
  @IsString()
  highestEducation: string;

  @ApiProperty({ example: 'University of Lagos' })
  @IsString()
  @IsOptional()
  currentInstitution?: string;

  @ApiProperty({ example: 2024 })
  @IsOptional()
  graduationYear?: number;

  @ApiProperty({ example: 'IELTS' })
  @IsString()
  @IsOptional()
  englishTestType?: string;

  @ApiProperty({ example: 7.5 })
  @IsOptional()
  englishTestScore?: number;
}
