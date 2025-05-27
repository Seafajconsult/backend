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
  Res,
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
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { InvoiceService } from "./invoice.service";
import { CreateInvoiceDto, UpdateInvoiceStatusDto, RecordPaymentDto } from "./dto/create-invoice.dto";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new invoice (Admin only)' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateInvoiceDto })
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all invoices with filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of invoices' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'invoiceType', required: false, description: 'Filter by invoice type' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date' })
  async getAllInvoices(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('invoiceType') invoiceType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (status) filters.status = status;
    if (invoiceType) filters.invoiceType = invoiceType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    return this.invoiceService.findAllInvoices(
      parseInt(page),
      parseInt(limit),
      filters
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns invoice statistics' })
  async getInvoiceStats() {
    return this.invoiceService.getInvoiceStats();
  }

  @Get(':invoiceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice details by ID' })
  @ApiResponse({ status: 200, description: 'Returns invoice details' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  async getInvoiceById(@Param('invoiceId') invoiceId: string) {
    return this.invoiceService.findInvoiceById(invoiceId);
  }

  @Get('number/:invoiceNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice details by invoice number' })
  @ApiResponse({ status: 200, description: 'Returns invoice details' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'invoiceNumber', description: 'Invoice number' })
  async getInvoiceByNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoiceService.findInvoiceByNumber(invoiceNumber);
  }

  @Put(':invoiceId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update invoice status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Invoice status updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  @ApiBody({ type: UpdateInvoiceStatusDto })
  async updateInvoiceStatus(
    @Param('invoiceId') invoiceId: string,
    @Body() updateStatusDto: UpdateInvoiceStatusDto
  ) {
    return this.invoiceService.updateInvoiceStatus(invoiceId, updateStatusDto);
  }

  @Post(':invoiceId/record-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record payment for invoice (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment data or invoice already paid' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  @ApiBody({ type: RecordPaymentDto })
  async recordPayment(
    @Param('invoiceId') invoiceId: string,
    @Body() recordPaymentDto: RecordPaymentDto
  ) {
    return this.invoiceService.recordPayment(invoiceId, recordPaymentDto);
  }

  @Get(':invoiceId/pdf')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download invoice PDF' })
  @ApiResponse({ status: 200, description: 'Returns invoice PDF' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  async downloadInvoicePdf(
    @Param('invoiceId') invoiceId: string,
    @Res() res: Response
  ) {
    const pdfUrl = await this.invoiceService.generateInvoicePdf(invoiceId);
    res.redirect(pdfUrl);
  }

  @Post(':invoiceId/send-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send invoice via email (Admin only)' })
  @ApiResponse({ status: 200, description: 'Invoice sent successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  async sendInvoiceEmail(@Param('invoiceId') invoiceId: string) {
    await this.invoiceService.sendInvoiceEmail(invoiceId);
    return { message: 'Invoice sent successfully' };
  }

  // User endpoints
  @Get('user/my-invoices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user invoices' })
  @ApiResponse({ status: 200, description: 'Returns user invoices' })
  async getMyInvoices(@Request() req: RequestWithUser) {
    return this.invoiceService.findUserInvoices(req.user.userId);
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user invoice statistics' })
  @ApiResponse({ status: 200, description: 'Returns user invoice statistics' })
  async getMyInvoiceStats(@Request() req: RequestWithUser) {
    return this.invoiceService.getInvoiceStats(req.user.userId);
  }
}
