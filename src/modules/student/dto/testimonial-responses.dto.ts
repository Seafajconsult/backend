import { ApiProperty } from '@nestjs/swagger';

export class TestimonialResponse {
  @ApiProperty({
    description: 'Unique identifier of the testimonial',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @ApiProperty({
    description: 'ID of the student who submitted the testimonial',
    example: '507f1f77bcf86cd799439012'
  })
  userId: string;

  @ApiProperty({
    description: 'The testimonial text content',
    example: 'My experience with SEA-FAJ Consulting was excellent!'
  })
  content: string;

  @ApiProperty({
    description: 'URL of the video testimonial if provided',
    example: 'https://example.com/video.mp4',
    required: false
  })
  videoUrl?: string;

  @ApiProperty({
    description: 'Rating given by the student (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5
  })
  rating: number;

  @ApiProperty({
    description: 'Current status of the testimonial',
    example: 'approved',
    enum: ['pending', 'approved', 'rejected']
  })
  status: string;

  @ApiProperty({
    description: 'When the testimonial was created',
    example: '2025-05-25T10:30:00Z'
  })
  createdAt: Date;
}

export class TestimonialListResponse {
  @ApiProperty({
    description: 'List of testimonials',
    type: [TestimonialResponse]
  })
  testimonials: TestimonialResponse[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      pages: 10
    }
  })
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
