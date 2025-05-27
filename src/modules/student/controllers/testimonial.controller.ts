import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TestimonialService } from '../services/testimonial.service';
import { CreateTestimonialDto, UpdateTestimonialStatusDto, TestimonialQueryParams } from '../dto/testimonial.dto';
import { TestimonialResponse, TestimonialListResponse } from '../dto/testimonial-responses.dto';
import { TestimonialStatus } from '../enums/testimonial-status.enum';

@ApiTags('Student Testimonials')
@Controller('testimonials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new testimonial',
    description: 'Submit a new text or video testimonial'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Testimonial created successfully',
    type: TestimonialResponse
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() req, @Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialService.create(req.user.id, createTestimonialDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all approved testimonials',
    description: 'Retrieve paginated list of approved testimonials'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number,
    description: 'Page number (default: 1)'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Items per page (default: 10)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of testimonials retrieved successfully',
    type: TestimonialListResponse
  })
  async findAll(@Query() query: TestimonialQueryParams) {
    return this.testimonialService.findAll({ 
      page: query.page ?? 1, 
      limit: query.limit ?? 10, 
      status: TestimonialStatus.APPROVED 
    });
  }

  @Get('my')
  @ApiOperation({ 
    summary: 'Get current user testimonials',
    description: 'Retrieve all testimonials submitted by the current user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User testimonials retrieved successfully',
    type: [TestimonialResponse]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findUserTestimonials(@Request() req) {
    return this.testimonialService.findByUserId(req.user.id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update testimonial status',
    description: 'Update the status of a testimonial. Only admins can approve/reject testimonials.'
  })
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'Testimonial ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Testimonial status updated successfully',
    type: TestimonialResponse
  })
  @ApiResponse({ status: 400, description: 'Invalid input or testimonial not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can update status' })
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTestimonialStatusDto,
  ) {
    return this.testimonialService.updateStatus(id, updateStatusDto.status, updateStatusDto.rejectionReason);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a testimonial',
    description: 'Delete a testimonial. Users can only delete their own testimonials.'
  })
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'Testimonial ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Testimonial deleted successfully'
  })
  @ApiResponse({ status: 400, description: 'Invalid input or testimonial not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own testimonials' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.testimonialService.delete(req.user.id, id);
  }
}
