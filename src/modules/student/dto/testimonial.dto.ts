import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsInt, Min, Max, IsEnum } from 'class-validator';
import { TestimonialStatus } from '../enums/testimonial-status.enum';

export class CreateTestimonialDto {
  @ApiProperty({
    description: 'The testimonial text content',
    example: 'My experience with SEA-FAJ Consulting was excellent!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'URL of the video testimonial if provided',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({
    description: 'Rating given by the student (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export class UpdateTestimonialStatusDto {
  @ApiProperty({
    description: 'The new status for the testimonial',
    enum: TestimonialStatus,
    example: TestimonialStatus.APPROVED,
  })
  @IsEnum(TestimonialStatus)
  status: TestimonialStatus;

  @ApiProperty({
    description: 'Reason for rejection if status is REJECTED',
    required: false,
    example: 'Inappropriate content',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class TestimonialQueryParams {
  @ApiProperty({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({
    description: 'Filter by status',
    enum: TestimonialStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TestimonialStatus)
  status?: TestimonialStatus;
}
