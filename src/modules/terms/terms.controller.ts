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
import { TermsService } from "./terms.service";
import { CreateTermsDto, UpdateTermsDto, AcceptTermsDto, WithdrawConsentDto } from "./dto/terms.dto";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags('Terms & Conditions')
@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  // Public endpoints
  @Get('active')
  @ApiOperation({ summary: 'Get all active terms' })
  @ApiResponse({ status: 200, description: 'Returns active terms' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by terms type' })
  async getActiveTerms(@Query('type') type?: string) {
    return this.termsService.getActiveTerms(type as any);
  }

  @Get(':termsId')
  @ApiOperation({ summary: 'Get terms by ID' })
  @ApiResponse({ status: 200, description: 'Returns terms details' })
  @ApiResponse({ status: 404, description: 'Terms not found' })
  @ApiParam({ name: 'termsId', description: 'Terms ID' })
  async getTermsById(@Param('termsId') termsId: string) {
    return this.termsService.getTermsById(termsId);
  }

  // User endpoints
  @Post('accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept terms and conditions' })
  @ApiResponse({ status: 201, description: 'Terms accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid acceptance data or terms already accepted' })
  @ApiBody({ type: AcceptTermsDto })
  async acceptTerms(
    @Request() req: RequestWithUser,
    @Body() acceptTermsDto: AcceptTermsDto
  ) {
    return this.termsService.acceptTerms(req.user.userId, acceptTermsDto);
  }

  @Get('user/acceptances')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user terms acceptances' })
  @ApiResponse({ status: 200, description: 'Returns user terms acceptances' })
  async getUserAcceptances(@Request() req: RequestWithUser) {
    return this.termsService.getUserAcceptances(req.user.userId);
  }

  @Get('user/compliance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check current user compliance with terms' })
  @ApiResponse({ status: 200, description: 'Returns user compliance status' })
  async checkUserCompliance(@Request() req: RequestWithUser) {
    return this.termsService.checkUserCompliance(req.user.userId, req.user.role);
  }

  @Put('acceptances/:acceptanceId/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw consent for previously accepted terms' })
  @ApiResponse({ status: 200, description: 'Consent withdrawn successfully' })
  @ApiResponse({ status: 404, description: 'Terms acceptance not found' })
  @ApiParam({ name: 'acceptanceId', description: 'Terms acceptance ID' })
  @ApiBody({ type: WithdrawConsentDto })
  async withdrawConsent(
    @Param('acceptanceId') acceptanceId: string,
    @Request() req: RequestWithUser,
    @Body() withdrawDto: WithdrawConsentDto
  ) {
    return this.termsService.withdrawConsent(req.user.userId, acceptanceId, withdrawDto);
  }

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new terms (Admin only)' })
  @ApiResponse({ status: 201, description: 'Terms created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid terms data' })
  @ApiBody({ type: CreateTermsDto })
  async createTerms(
    @Request() req: RequestWithUser,
    @Body() createTermsDto: CreateTermsDto
  ) {
    return this.termsService.createTerms(createTermsDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all terms with filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of terms' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by terms type' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  async getAllTerms(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    const filters: any = {};
    if (type) filters.type = type;
    if (status) filters.status = status;

    return this.termsService.getAllTerms(
      parseInt(page),
      parseInt(limit),
      filters
    );
  }

  @Put(':termsId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update terms (Admin only)' })
  @ApiResponse({ status: 200, description: 'Terms updated successfully' })
  @ApiResponse({ status: 400, description: 'Cannot update active terms' })
  @ApiResponse({ status: 404, description: 'Terms not found' })
  @ApiParam({ name: 'termsId', description: 'Terms ID' })
  @ApiBody({ type: UpdateTermsDto })
  async updateTerms(
    @Param('termsId') termsId: string,
    @Body() updateTermsDto: UpdateTermsDto
  ) {
    return this.termsService.updateTerms(termsId, updateTermsDto);
  }

  @Post(':termsId/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate terms (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Terms activated successfully' })
  @ApiResponse({ status: 404, description: 'Terms not found' })
  @ApiParam({ name: 'termsId', description: 'Terms ID' })
  async activateTerms(
    @Param('termsId') termsId: string,
    @Request() req: RequestWithUser
  ) {
    return this.termsService.activateTerms(termsId, req.user.userId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get terms statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns terms statistics' })
  async getTermsStats() {
    return this.termsService.getTermsStats();
  }
}
