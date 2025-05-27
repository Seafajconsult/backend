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
import { ReferralService } from "./referral.service";
import { 
  ProcessReferralDto, 
  UpdateReferralStatusDto, 
  CreateReferralProgramDto, 
  CreateRewardDto, 
  UpdateRewardStatusDto, 
  ProcessRewardPaymentDto 
} from "./dto/referral.dto";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags('Referrals')
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  // User endpoints
  @Post('process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a referral (Admin only)' })
  @ApiResponse({ status: 201, description: 'Referral processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid referral data' })
  @ApiBody({ type: ProcessReferralDto })
  async processReferral(@Body() processReferralDto: ProcessReferralDto) {
    return this.referralService.processReferral(processReferralDto);
  }

  @Get('my-referrals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user referrals' })
  @ApiResponse({ status: 200, description: 'Returns user referrals' })
  async getMyReferrals(@Request() req: RequestWithUser) {
    return this.referralService.getUserReferrals(req.user.userId);
  }

  @Get('my-rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user rewards' })
  @ApiResponse({ status: 200, description: 'Returns user rewards' })
  async getMyRewards(@Request() req: RequestWithUser) {
    return this.referralService.getUserRewards(req.user.userId);
  }

  @Get('my-stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user referral statistics' })
  @ApiResponse({ status: 200, description: 'Returns user referral statistics' })
  async getMyReferralStats(@Request() req: RequestWithUser) {
    return this.referralService.getReferralStats(req.user.userId);
  }

  // Admin endpoints
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all referrals with filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of referrals' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'referrerId', required: false, description: 'Filter by referrer ID' })
  @ApiQuery({ name: 'refereeId', required: false, description: 'Filter by referee ID' })
  async getAllReferrals(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('referrerId') referrerId?: string,
    @Query('refereeId') refereeId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (referrerId) filters.referrerId = referrerId;
    if (refereeId) filters.refereeId = refereeId;

    return this.referralService.getAllReferrals(
      parseInt(page),
      parseInt(limit),
      filters
    );
  }

  @Get('rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all rewards with filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of rewards' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'rewardType', required: false, description: 'Filter by reward type' })
  async getAllRewards(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('rewardType') rewardType?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (userId) filters.userId = userId;
    if (rewardType) filters.rewardType = rewardType;

    return this.referralService.getAllRewards(
      parseInt(page),
      parseInt(limit),
      filters
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get overall referral statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns overall referral statistics' })
  async getOverallReferralStats() {
    return this.referralService.getReferralStats();
  }

  @Put(':referralId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update referral status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Referral status updated successfully' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiParam({ name: 'referralId', description: 'Referral ID' })
  @ApiBody({ type: UpdateReferralStatusDto })
  async updateReferralStatus(
    @Param('referralId') referralId: string,
    @Body() updateStatusDto: UpdateReferralStatusDto
  ) {
    return this.referralService.updateReferralStatus(referralId, updateStatusDto);
  }

  @Post('programs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create referral program (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Referral program created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid program data' })
  @ApiBody({ type: CreateReferralProgramDto })
  async createReferralProgram(@Body() createProgramDto: CreateReferralProgramDto) {
    return this.referralService.createReferralProgram(createProgramDto);
  }

  @Post('rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create manual reward (Admin only)' })
  @ApiResponse({ status: 201, description: 'Reward created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid reward data' })
  @ApiBody({ type: CreateRewardDto })
  async createReward(@Body() createRewardDto: CreateRewardDto) {
    return this.referralService.createReward(createRewardDto);
  }

  @Put('rewards/:rewardId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update reward status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward status updated successfully' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @ApiParam({ name: 'rewardId', description: 'Reward ID' })
  @ApiBody({ type: UpdateRewardStatusDto })
  async updateRewardStatus(
    @Param('rewardId') rewardId: string,
    @Body() updateStatusDto: UpdateRewardStatusDto
  ) {
    return this.referralService.updateRewardStatus(rewardId, updateStatusDto);
  }

  @Post('rewards/:rewardId/process-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process reward payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment data or reward not approved' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @ApiParam({ name: 'rewardId', description: 'Reward ID' })
  @ApiBody({ type: ProcessRewardPaymentDto })
  async processRewardPayment(
    @Param('rewardId') rewardId: string,
    @Body() paymentDto: ProcessRewardPaymentDto
  ) {
    return this.referralService.processRewardPayment(rewardId, paymentDto);
  }
}
