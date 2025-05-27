import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsPhoneNumber, IsUrl, IsEmail } from 'class-validator';
import { EmployerStatus, SubscriptionTier } from '../../user/schemas/employer-profile.schema';

export class CreateEmployerProfileDto {
  @ApiProperty({ example: 'Acme Corporation Ltd.' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'RC123456' })
  @IsString()
  businessRegistrationNumber: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  contactPersonName: string;

  @ApiProperty({ example: 'HR Director' })
  @IsString()
  contactPersonPosition: string;

  @ApiProperty({ example: '+2341234567890' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'Technology' })
  @IsString()
  industry: string;

  @ApiProperty({ example: '51-200' })
  @IsString()
  companySize: string;

  @ApiProperty({ example: '123 Business District, Lagos, Nigeria' })
  @IsString()
  address: string;

  @ApiProperty({ 
    example: 'https://www.acmecorp.com',
    required: false
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ 
    enum: EmployerStatus,
    example: EmployerStatus.PENDING,
    default: EmployerStatus.PENDING
  })
  @IsEnum(EmployerStatus)
  @IsOptional()
  status?: EmployerStatus;

  @ApiProperty({ 
    enum: SubscriptionTier,
    example: SubscriptionTier.BASIC,
    default: SubscriptionTier.NONE
  })
  @IsEnum(SubscriptionTier)
  @IsOptional()
  subscriptionTier?: SubscriptionTier;
}
