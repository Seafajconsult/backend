import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { JobService } from "./job.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ApplyJobDto, UpdateApplicationStatusDto, ScheduleInterviewDto } from "./dto/apply-job.dto";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // Public endpoints
  @Get()
  @ApiOperation({ summary: 'Get all active jobs with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of jobs' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
  @ApiQuery({ name: 'jobType', required: false, description: 'Filter by job type' })
  @ApiQuery({ name: 'experienceLevel', required: false, description: 'Filter by experience level' })
  @ApiQuery({ name: 'skills', required: false, description: 'Filter by skills (comma-separated)' })
  @ApiQuery({ name: 'salaryMin', required: false, description: 'Minimum salary filter' })
  @ApiQuery({ name: 'salaryMax', required: false, description: 'Maximum salary filter' })
  @ApiQuery({ name: 'isRemote', required: false, description: 'Filter remote jobs' })
  async getAllJobs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('location') location?: string,
    @Query('jobType') jobType?: string,
    @Query('experienceLevel') experienceLevel?: string,
    @Query('skills') skills?: string,
    @Query('salaryMin') salaryMin?: string,
    @Query('salaryMax') salaryMax?: string,
    @Query('isRemote') isRemote?: string,
  ) {
    const filters: any = {};
    
    if (location) filters.location = location;
    if (jobType) filters.jobType = jobType;
    if (experienceLevel) filters.experienceLevel = experienceLevel;
    if (skills) filters.skills = skills.split(',');
    if (salaryMin) filters.salaryMin = parseInt(salaryMin);
    if (salaryMax) filters.salaryMax = parseInt(salaryMax);
    if (isRemote) filters.isRemote = isRemote === 'true';

    return this.jobService.findAllJobs(
      parseInt(page),
      parseInt(limit),
      filters
    );
  }

  @Get(':jobId')
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiResponse({ status: 200, description: 'Returns job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  async getJobById(@Param('jobId') jobId: string) {
    return this.jobService.findJobById(jobId);
  }

  // Employer endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateJobDto })
  async createJob(
    @Request() req: RequestWithUser,
    @Body() createJobDto: CreateJobDto
  ) {
    return this.jobService.createJob(req.user.userId, createJobDto);
  }

  @Get('employer/my-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs posted by the current employer' })
  @ApiResponse({ status: 200, description: 'Returns employer jobs' })
  async getMyJobs(@Request() req: RequestWithUser) {
    return this.jobService.findJobsByEmployer(req.user.userId);
  }

  @Put(':jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job posting' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this job' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiBody({ type: UpdateJobDto })
  async updateJob(
    @Param('jobId') jobId: string,
    @Request() req: RequestWithUser,
    @Body() updateJobDto: UpdateJobDto
  ) {
    return this.jobService.updateJob(jobId, req.user.userId, updateJobDto);
  }

  @Delete(':jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job posting' })
  @ApiResponse({ status: 204, description: 'Job deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this job' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJob(
    @Param('jobId') jobId: string,
    @Request() req: RequestWithUser
  ) {
    await this.jobService.deleteJob(jobId, req.user.userId);
  }

  // Job application endpoints
  @Post(':jobId/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid application data or already applied' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiBody({ type: ApplyJobDto })
  async applyForJob(
    @Param('jobId') jobId: string,
    @Request() req: RequestWithUser,
    @Body() applyJobDto: ApplyJobDto
  ) {
    return this.jobService.applyForJob(jobId, req.user.userId, applyJobDto);
  }

  @Get(':jobId/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get applications for a specific job' })
  @ApiResponse({ status: 200, description: 'Returns job applications' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async getJobApplications(
    @Param('jobId') jobId: string,
    @Request() req: RequestWithUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.jobService.getJobApplications(
      jobId,
      req.user.userId,
      parseInt(page),
      parseInt(limit)
    );
  }

  @Get('applications/:applicationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application details by ID' })
  @ApiResponse({ status: 200, description: 'Returns application details' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  async getApplicationById(
    @Param('applicationId') applicationId: string,
    @Request() req: RequestWithUser
  ) {
    return this.jobService.getApplicationById(applicationId, req.user.userId);
  }

  @Put('applications/:applicationId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({ status: 200, description: 'Application status updated successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  @ApiBody({ type: UpdateApplicationStatusDto })
  async updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Request() req: RequestWithUser,
    @Body() updateStatusDto: UpdateApplicationStatusDto
  ) {
    return this.jobService.updateApplicationStatus(
      applicationId,
      req.user.userId,
      updateStatusDto
    );
  }

  @Post('applications/:applicationId/schedule-interview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule an interview for an application' })
  @ApiResponse({ status: 200, description: 'Interview scheduled successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  @ApiBody({ type: ScheduleInterviewDto })
  async scheduleInterview(
    @Param('applicationId') applicationId: string,
    @Request() req: RequestWithUser,
    @Body() scheduleInterviewDto: ScheduleInterviewDto
  ) {
    return this.jobService.scheduleInterview(
      applicationId,
      req.user.userId,
      scheduleInterviewDto
    );
  }

  @Get('applications/my-applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user job applications' })
  @ApiResponse({ status: 200, description: 'Returns user applications' })
  async getMyApplications(@Request() req: RequestWithUser) {
    return this.jobService.getApplicantApplications(req.user.userId);
  }

  @Get('employer/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employer job statistics' })
  @ApiResponse({ status: 200, description: 'Returns job statistics' })
  async getJobStats(@Request() req: RequestWithUser) {
    return this.jobService.getJobStats(req.user.userId);
  }
}
