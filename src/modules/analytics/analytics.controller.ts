import {
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  Res,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { AnalyticsService } from "./analytics.service";
import { ReportQueryDto, ReportFormat } from "./dto/report-query.dto";
import { Response } from "express";

@Controller("analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("daily")
  async getDailyAnalytics() {
    return this.analyticsService.generateDailyAnalytics();
  }

  @Get("range")
  async getAnalyticsByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    return this.analyticsService.getAnalyticsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post("reports")
  async generateReport(
    @Body() reportQuery: ReportQueryDto,
    @Res() res: Response,
  ) {
    const report =
      await this.analyticsService.generateCustomReport(reportQuery);

    const fileName = `report-${reportQuery.type}-${new Date().toISOString()}.${reportQuery.format.toLowerCase()}`;

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    switch (reportQuery.format) {
      case ReportFormat.CSV:
        res.setHeader("Content-Type", "text/csv");
        return res.send(report);
      case ReportFormat.PDF:
        res.setHeader("Content-Type", "application/pdf");
        return res.send(report);
      default:
        res.setHeader("Content-Type", "application/json");
        return res.json(report);
    }
  }

  @Get("dashboard")
  async getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Get("trends")
  async getTrends(
    @Query("metric") metric: string,
    @Query("period") period: "daily" | "weekly" | "monthly" = "daily",
  ) {
    return this.analyticsService.getMetricTrends(metric, period);
  }

  @Get("dashboard/comprehensive")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get comprehensive dashboard data (Super Admin only)" })
  async getComprehensiveDashboard() {
    return this.analyticsService.getComprehensiveDashboard();
  }

  @Get("dashboard/jobs")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get job metrics dashboard" })
  async getJobMetrics(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.analyticsService.getJobMetrics(startDate, endDate);
  }

  @Get("dashboard/recruitment")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get recruitment metrics dashboard" })
  async getRecruitmentMetrics(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.analyticsService.getRecruitmentMetrics(startDate, endDate);
  }

  @Get("dashboard/invoices")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get invoice metrics dashboard" })
  async getInvoiceMetrics(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.analyticsService.getInvoiceMetrics(startDate, endDate);
  }

  @Get("dashboard/referrals")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get referral metrics dashboard" })
  async getReferralMetrics(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.analyticsService.getReferralMetrics(startDate, endDate);
  }
}
