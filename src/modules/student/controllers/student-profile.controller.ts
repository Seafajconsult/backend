import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StudentProfileService } from '../services/student-profile.service';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { ProfileCompletionResponse, ProfileUpdateHistoryResponse } from '../dto/profile-responses.dto';

@ApiTags('Student Profile')
@Controller('student-profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get current student profile',
    description: 'Retrieves the complete profile information for the currently authenticated student'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    type: UpdateStudentProfileDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentProfile(@Request() req) {
    return this.studentProfileService.findByUserId(req.user.id);
  }

  @Put()
  @ApiOperation({ 
    summary: 'Update student profile',
    description: 'Updates the profile information for the currently authenticated student'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: UpdateStudentProfileDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateStudentProfileDto) {
    return this.studentProfileService.update(req.user.id, updateProfileDto);
  }

  @Get('completion')
  @ApiOperation({ 
    summary: 'Get profile completion percentage',
    description: 'Calculates and retrieves the profile completion percentage'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile completion retrieved successfully',
    type: ProfileCompletionResponse
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfileCompletion(@Request() req) {
    return this.studentProfileService.calculateProfileCompletion(req.user.id);
  }

  @Get('history')
  @ApiOperation({ 
    summary: 'Get profile update history',
    description: 'Retrieves the history of all updates made to the student profile'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile update history retrieved successfully',
    type: ProfileUpdateHistoryResponse
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUpdateHistory(@Request() req) {
    return this.studentProfileService.getUpdateHistory(req.user.id);
  }
}
