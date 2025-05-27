import { ApiProperty } from '@nestjs/swagger';

export class ProfileCompletionResponse {
  @ApiProperty({
    description: 'The percentage of profile completion',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  completionPercentage: number;
}

export class ProfileUpdateHistoryItem {
  @ApiProperty({
    description: 'When the update was made',
    example: '2025-05-25T10:30:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of fields that were updated',
    example: ['education', 'skills']
  })
  updatedFields: string[];

  @ApiProperty({
    description: 'Previous values of the updated fields',
    example: {
      education: [{
        degree: 'Bachelor of Science',
        field: 'Computer Science'
      }]
    }
  })
  previousValues: Record<string, any>;
}

export class ProfileUpdateHistoryResponse {
  @ApiProperty({
    description: 'List of profile updates',
    type: [ProfileUpdateHistoryItem]
  })
  updates: ProfileUpdateHistoryItem[];
}
