import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
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
import { RecruitmentService } from "./recruitment.service";
import { CreateRecruitmentRequestDto, UpdateRecruitmentStatusDto, AssignRecruiterDto } from "./dto/create-recruitment-request.dto";
import { AddCandidateDto, UpdateCandidateStatusDto, ScheduleCandidateInterviewDto, CandidateInterviewFeedbackDto } from "./dto/candidate.dto";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags('Recruitment')
@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  // Employer endpoints
  @Post('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new recruitment request' })
  @ApiResponse({ status: 201, description: 'Recruitment request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateRecruitmentRequestDto })
  async createRecruitmentRequest(
    @Request() req: RequestWithUser,
    @Body() createRequestDto: CreateRecruitmentRequestDto
  ) {
    return this.recruitmentService.createRecruitmentRequest(req.user.userId, createRequestDto);
  }

  @Get('requests/my-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all recruitment requests for the current employer' })
  @ApiResponse({ status: 200, description: 'Returns employer recruitment requests' })
  async getMyRecruitmentRequests(@Request() req: RequestWithUser) {
    return this.recruitmentService.findRequestsByEmployer(req.user.userId);
  }

  @Get('requests/:requestId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recruitment request details by ID' })
  @ApiResponse({ status: 200, description: 'Returns recruitment request details' })
  @ApiResponse({ status: 404, description: 'Recruitment request not found' })
  @ApiParam({ name: 'requestId', description: 'Recruitment request ID' })
  async getRecruitmentRequestById(@Param('requestId') requestId: string) {
    return this.recruitmentService.findRequestById(requestId);
  }

  @Get('requests/:requestId/candidates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get candidates for a recruitment request' })
  @ApiResponse({ status: 200, description: 'Returns candidates for the recruitment request' })
  @ApiParam({ name: 'requestId', description: 'Recruitment request ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async getRecruitmentCandidates(
    @Param('requestId') requestId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.recruitmentService.getCandidates(
      requestId,
      parseInt(page),
      parseInt(limit)
    );
  }

  @Get('employer/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employer recruitment statistics' })
  @ApiResponse({ status: 200, description: 'Returns recruitment statistics' })
  async getEmployerRecruitmentStats(@Request() req: RequestWithUser) {
    return this.recruitmentService.getRecruitmentStats(req.user.userId);
  }

  // Admin endpoints
  @Get('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all recruitment requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of recruitment requests' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'serviceType', required: false, description: 'Filter by service type' })
  @ApiQuery({ name: 'employerId', required: false, description: 'Filter by employer ID' })
  async getAllRecruitmentRequests(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('serviceType') serviceType?: string,
    @Query('employerId') employerId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (serviceType) filters.serviceType = serviceType;
    if (employerId) filters.employerId = employerId;

    return this.recruitmentService.findAllRequests(
      parseInt(page),
      parseInt(limit),
      filters
    );
  }

  @Put('requests/:requestId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update recruitment request status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Recruitment request status updated successfully' })
  @ApiResponse({ status: 404, description: 'Recruitment request not found' })
  @ApiParam({ name: 'requestId', description: 'Recruitment request ID' })
  @ApiBody({ type: UpdateRecruitmentStatusDto })
  async updateRecruitmentStatus(
    @Param('requestId') requestId: string,
    @Request() req: RequestWithUser,
    @Body() updateStatusDto: UpdateRecruitmentStatusDto
  ) {
    return this.recruitmentService.updateRequestStatus(
      requestId,
      updateStatusDto,
      req.user.userId
    );
  }

  @Post('requests/:requestId/assign-recruiter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign recruiter to recruitment request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Recruiter assigned successfully' })
  @ApiResponse({ status: 404, description: 'Recruitment request not found' })
  @ApiParam({ name: 'requestId', description: 'Recruitment request ID' })
  @ApiBody({ type: AssignRecruiterDto })
  async assignRecruiter(
    @Param('requestId') requestId: string,
    @Request() req: RequestWithUser,
    @Body() assignRecruiterDto: AssignRecruiterDto
  ) {
    return this.recruitmentService.assignRecruiter(
      requestId,
      assignRecruiterDto,
      req.user.userId
    );
  }

  @Post('requests/:requestId/candidates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add candidate to recruitment request (Admin only)' })
  @ApiResponse({ status: 201, description: 'Candidate added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid candidate data or already added' })
  @ApiParam({ name: 'requestId', description: 'Recruitment request ID' })
  @ApiBody({ type: AddCandidateDto })
  async addCandidate(
    @Param('requestId') requestId: string,
    @Request() req: RequestWithUser,
    @Body() addCandidateDto: AddCandidateDto
  ) {
    return this.recruitmentService.addCandidate(
      requestId,
      addCandidateDto,
      req.user.userId
    );
  }

  @Put('candidates/:candidateId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update candidate status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Candidate status updated successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  @ApiParam({ name: 'candidateId', description: 'Candidate ID' })
  @ApiBody({ type: UpdateCandidateStatusDto })
  async updateCandidateStatus(
    @Param('candidateId') candidateId: string,
    @Request() req: RequestWithUser,
    @Body() updateStatusDto: UpdateCandidateStatusDto
  ) {
    return this.recruitmentService.updateCandidateStatus(
      candidateId,
      updateStatusDto,
      req.user.userId
    );
  }

  @Post('candidates/:candidateId/schedule-interview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule interview for candidate (Admin only)' })
  @ApiResponse({ status: 200, description: 'Interview scheduled successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  @ApiParam({ name: 'candidateId', description: 'Candidate ID' })
  @ApiBody({ type: ScheduleCandidateInterviewDto })
  async scheduleInterview(
    @Param('candidateId') candidateId: string,
    @Request() req: RequestWithUser,
    @Body() scheduleInterviewDto: ScheduleCandidateInterviewDto
  ) {
    return this.recruitmentService.scheduleInterview(
      candidateId,
      scheduleInterviewDto,
      req.user.userId
    );
  }

  @Post('candidates/:candidateId/interview-feedback')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add interview feedback for candidate (Admin only)' })
  @ApiResponse({ status: 200, description: 'Interview feedback added successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  @ApiParam({ name: 'candidateId', description: 'Candidate ID' })
  @ApiBody({ type: CandidateInterviewFeedbackDto })
  async addInterviewFeedback(
    @Param('candidateId') candidateId: string,
    @Request() req: RequestWithUser,
    @Body() feedbackDto: CandidateInterviewFeedbackDto
  ) {
    return this.recruitmentService.addInterviewFeedback(
      candidateId,
      feedbackDto,
      req.user.userId
    );
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get overall recruitment statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns overall recruitment statistics' })
  async getOverallRecruitmentStats() {
    return this.recruitmentService.getRecruitmentStats();
  }
}
