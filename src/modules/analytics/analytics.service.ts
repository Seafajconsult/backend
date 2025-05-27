import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Analytics } from "./analytics.schema";
import {
  Application,
  ApplicationStatus,
} from "../application/application.schema";
import { Document as MongooseDocument } from "mongoose";

interface TimestampedDocument extends MongooseDocument {
  createdAt: Date;
  updatedAt: Date;
}
import { Payment, PaymentType } from "../payment/payment.schema";
import {
  ReportQueryDto,
  ReportType,
  ReportFormat,
} from "./dto/report-query.dto";
import { Message } from "../message/message.schema";
import { UserDocument } from "../document/document.schema";
import { User } from "../user/user.schema";
import { Job, JobApplication } from "../job/job.schema";
import { RecruitmentRequest, RecruitmentCandidate } from "../recruitment/recruitment.schema";
import { Invoice } from "../invoice/invoice.schema";
import { Referral, ReferralReward } from "../referral/referral.schema";
import * as PDFDocument from "pdfkit";
import { Parser } from "json2csv";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(UserDocument.name) private documentModel: Model<UserDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(JobApplication.name) private jobApplicationModel: Model<JobApplication>,
    @InjectModel(RecruitmentRequest.name) private recruitmentRequestModel: Model<RecruitmentRequest>,
    @InjectModel(RecruitmentCandidate.name) private recruitmentCandidateModel: Model<RecruitmentCandidate>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Referral.name) private referralModel: Model<Referral>,
    @InjectModel(ReferralReward.name) private referralRewardModel: Model<ReferralReward>,
  ) {}

  async generateCustomReport(reportQuery: ReportQueryDto) {
    const data = await this.getReportData(reportQuery);

    switch (reportQuery.format) {
      case ReportFormat.CSV:
        return this.generateCSV(data);
      case ReportFormat.PDF:
        return this.generatePDF(data);
      default:
        return data;
    }
  }

  private async getReportData(reportQuery: ReportQueryDto) {
    const { startDate, endDate, type } = reportQuery;

    switch (type) {
      case ReportType.APPLICATION_METRICS:
        return this.getApplicationMetrics(startDate, endDate);
      case ReportType.REVENUE_ANALYSIS:
        return this.getRevenueAnalysis(startDate, endDate);
      case ReportType.USER_ENGAGEMENT:
        return this.getUserEngagementMetrics(startDate, endDate);
      case ReportType.DOCUMENT_VERIFICATION:
        return this.getDocumentVerificationMetrics(startDate, endDate);
      default:
        throw new Error("Invalid report type");
    }
  }

  private generateCSV(data: Record<string, unknown>) {
    const parser = new Parser();
    return parser.parse(data);
  }

  private generatePDF(data: Record<string, unknown>) {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.fontSize(16).text("Analytics Report", { align: "center" });
    doc.moveDown();

    Object.entries(data).forEach(([key, value]) => {
      doc.fontSize(12).text(`${key}: ${JSON.stringify(value)}`);
      doc.moveDown();
    });

    doc.end();
    return Buffer.concat(buffers);
  }

  async generateDailyAnalytics() {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));

    const metrics = await this.calculateDailyMetrics(yesterday);

    const analytics = new this.analyticsModel({
      date: yesterday,
      metrics,
    });

    return analytics.save();
  }

  async getAnalyticsByDateRange(startDate: Date, endDate: Date) {
    return this.analyticsModel
      .find({
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: 1 });
  }

  private async calculateDailyMetrics(date: Date) {
    const [totalUsers, applications, payments] = await Promise.all([
      this.getUserCount(),
      this.getApplicationMetrics(date.toISOString(), date.toISOString()),
      this.getRevenueAnalysis(date.toISOString(), date.toISOString()),
    ]);

    return {
      totalUsers,
      ...applications,
      ...payments,
    };
  }

  async getDashboardMetrics() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    const [recentAnalytics, totalUsers, activeApplications, monthlyRevenue] =
      await Promise.all([
        this.analyticsModel.findOne().sort({ date: -1 }),
        this.getUserCount(),
        this.getActiveApplicationsCount(),
        this.getMonthlyRevenue(thirtyDaysAgo, today),
      ]);

    return {
      currentMetrics: recentAnalytics?.metrics || {},
      totalUsers,
      activeApplications,
      monthlyRevenue,
      lastUpdated: recentAnalytics?.date,
    };
  }

  async getMetricTrends(
    metric: string,
    period: "daily" | "weekly" | "monthly",
  ) {
    const endDate = new Date();
    const startDate = this.getStartDateForPeriod(period);

    const analytics = await this.analyticsModel
      .find({
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: 1 });

    return this.aggregateMetricsByPeriod(analytics, metric, period);
  }

  private getStartDateForPeriod(period: string): Date {
    const date = new Date();
    switch (period) {
      case "daily":
        date.setDate(date.getDate() - 30);
        break;
      case "weekly":
        date.setDate(date.getDate() - 90);
        break;
      case "monthly":
        date.setMonth(date.getMonth() - 12);
        break;
    }
    return date;
  }

  private aggregateMetricsByPeriod(
    analytics: Analytics[],
    metric: string,
    period: string,
  ) {
    return analytics.map((record) => ({
      date: record.date,
      value: record.metrics[metric] || 0,
    }));
  }

  private async getApplicationMetrics(startDate: string, endDate: string) {
    const applications = await this.applicationModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const totalApplications = applications.length;
    const statusCounts = applications.reduce(
      (acc: Record<ApplicationStatus, number>, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    const completionRate =
      ((statusCounts["completed"] || 0) / totalApplications) * 100;

    return {
      totalApplications,
      statusDistribution: statusCounts,
      completionRate,
      averageProcessingTime: await this.calculateAverageProcessingTime(
        startDate,
        endDate,
      ),
    };
  }

  private async getRevenueAnalysis(startDate: string, endDate: string) {
    const payments = await this.paymentModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: "completed",
    });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const initialRevenueByType = {
      [PaymentType.APPLICATION_FEE]: 0,
      [PaymentType.SERVICE_CHARGE]: 0,
      [PaymentType.CONSULTATION_FEE]: 0,
    };
    const revenueByType = payments.reduce(
      (acc: Record<PaymentType, number>, payment) => {
        acc[payment.paymentType] =
          (acc[payment.paymentType] || 0) + payment.amount;
        return acc;
      },
      initialRevenueByType,
    );

    return {
      totalRevenue,
      revenueByType,
      averageTransactionValue: totalRevenue / payments.length,
      transactionCount: payments.length,
    };
  }

  private async getUserEngagementMetrics(startDate: string, endDate: string) {
    const dateRange = {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const [applications, messages, documents] = await Promise.all([
      this.applicationModel.countDocuments(dateRange),
      this.messageModel.countDocuments(dateRange),
      this.documentModel.countDocuments(dateRange),
    ]);

    return {
      newApplications: applications,
      messagesSent: messages,
      documentsUploaded: documents,
      engagementScore: this.calculateEngagementScore(
        applications,
        messages,
        documents,
      ),
    };
  }

  private async getDocumentVerificationMetrics(
    startDate: string,
    endDate: string,
  ) {
    const documents = await this.documentModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const totalDocuments = documents.length;
    const verifiedDocuments = documents.filter(
      (doc) => doc.status === "approved",
    ).length;
    const rejectedDocuments = documents.filter(
      (doc) => doc.status === "rejected",
    ).length;

    return {
      totalDocuments,
      verifiedDocuments,
      rejectedDocuments,
      verificationRate: (verifiedDocuments / totalDocuments) * 100,
      averageVerificationTime: await this.calculateAverageVerificationTime(),
    };
  }

  private async getUserCount() {
    return this.userModel.countDocuments();
  }

  private async getActiveApplicationsCount() {
    return this.applicationModel.countDocuments({
      status: { $nin: ["completed", "cancelled"] },
    });
  }

  private async getMonthlyRevenue(startDate: Date, endDate: Date) {
    const payments = await this.paymentModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "completed",
    });

    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  private calculateEngagementScore(
    applications: number,
    messages: number,
    documents: number,
  ): number {
    // Simple weighted scoring system
    const weights = {
      applications: 0.4,
      messages: 0.3,
      documents: 0.3,
    };

    return (
      applications * weights.applications +
      messages * weights.messages +
      documents * weights.documents
    );
  }

  private async calculateAverageProcessingTime(
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const completedApplications = await this.applicationModel.find({
      status: ApplicationStatus.COMPLETED,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    if (completedApplications.length === 0) return 0;

    const totalTime = completedApplications.reduce((sum, app) => {
      const appWithTimestamps = app as unknown as TimestampedDocument;
      return (
        sum +
        (appWithTimestamps.updatedAt.getTime() -
          appWithTimestamps.createdAt.getTime())
      );
    }, 0);

    return totalTime / completedApplications.length / (1000 * 60 * 60); // Convert to hours
  }

  private async calculateAverageVerificationTime(): Promise<number> {
    const documents = await this.documentModel.find({
      status: { $in: ["approved", "rejected"] },
    });

    if (documents.length === 0) return 0;

    const totalTime = documents.reduce((sum, doc) => {
      const docWithTimestamps = doc as unknown as TimestampedDocument;
      return (
        sum +
        (docWithTimestamps.updatedAt.getTime() -
          docWithTimestamps.createdAt.getTime())
      );
    }, 0);

    return totalTime / documents.length / (1000 * 60 * 60); // Convert to hours
  }

  // Enhanced Analytics Methods for New Features

  async getJobMetrics(startDate?: string, endDate?: string) {
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      jobsByType,
      topEmployers,
      applicationsByStatus,
    ] = await Promise.all([
      this.jobModel.countDocuments(dateFilter),
      this.jobModel.countDocuments({ ...dateFilter, status: 'active' }),
      this.jobApplicationModel.countDocuments(dateFilter),
      this.getJobsByType(dateFilter),
      this.getTopEmployers(dateFilter),
      this.getJobApplicationsByStatus(dateFilter),
    ]);

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      jobsByType,
      topEmployers,
      applicationsByStatus,
      averageApplicationsPerJob: totalJobs > 0 ? totalApplications / totalJobs : 0,
    };
  }

  async getRecruitmentMetrics(startDate?: string, endDate?: string) {
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const [
      totalRequests,
      requestsByStatus,
      requestsByServiceType,
      totalCandidates,
      candidatesByStatus,
      averageTimeToFill,
    ] = await Promise.all([
      this.recruitmentRequestModel.countDocuments(dateFilter),
      this.getRecruitmentRequestsByStatus(dateFilter),
      this.getRecruitmentRequestsByServiceType(dateFilter),
      this.recruitmentCandidateModel.countDocuments(dateFilter),
      this.getRecruitmentCandidatesByStatus(dateFilter),
      this.calculateAverageTimeToFill(dateFilter),
    ]);

    return {
      totalRequests,
      requestsByStatus,
      requestsByServiceType,
      totalCandidates,
      candidatesByStatus,
      averageTimeToFill,
      averageCandidatesPerRequest: totalRequests > 0 ? totalCandidates / totalRequests : 0,
    };
  }

  async getInvoiceMetrics(startDate?: string, endDate?: string) {
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const [
      totalInvoices,
      invoicesByStatus,
      invoicesByType,
      totalAmount,
      paidAmount,
      averageInvoiceValue,
    ] = await Promise.all([
      this.invoiceModel.countDocuments(dateFilter),
      this.getInvoicesByStatus(dateFilter),
      this.getInvoicesByType(dateFilter),
      this.getTotalInvoiceAmount(dateFilter),
      this.getPaidInvoiceAmount(dateFilter),
      this.getAverageInvoiceValue(dateFilter),
    ]);

    return {
      totalInvoices,
      invoicesByStatus,
      invoicesByType,
      totalAmount,
      paidAmount,
      outstandingAmount: totalAmount - paidAmount,
      averageInvoiceValue,
      paymentRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0,
    };
  }

  async getReferralMetrics(startDate?: string, endDate?: string) {
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const [
      totalReferrals,
      referralsByStatus,
      totalRewards,
      rewardsByStatus,
      totalRewardValue,
      paidRewardValue,
      topReferrers,
    ] = await Promise.all([
      this.referralModel.countDocuments(dateFilter),
      this.getReferralsByStatus(dateFilter),
      this.referralRewardModel.countDocuments(dateFilter),
      this.getRewardsByStatus(dateFilter),
      this.getTotalRewardValue(dateFilter),
      this.getPaidRewardValue(dateFilter),
      this.getTopReferrers(dateFilter),
    ]);

    return {
      totalReferrals,
      referralsByStatus,
      totalRewards,
      rewardsByStatus,
      totalRewardValue,
      paidRewardValue,
      pendingRewardValue: totalRewardValue - paidRewardValue,
      topReferrers,
      conversionRate: totalReferrals > 0 ? (referralsByStatus.qualified || 0) / totalReferrals * 100 : 0,
    };
  }

  async getComprehensiveDashboard() {
    const [
      userMetrics,
      applicationMetrics,
      jobMetrics,
      recruitmentMetrics,
      invoiceMetrics,
      referralMetrics,
      recentActivity,
    ] = await Promise.all([
      this.getUserMetrics(),
      this.getApplicationMetrics(),
      this.getJobMetrics(),
      this.getRecruitmentMetrics(),
      this.getInvoiceMetrics(),
      this.getReferralMetrics(),
      this.getRecentActivity(),
    ]);

    return {
      userMetrics,
      applicationMetrics,
      jobMetrics,
      recruitmentMetrics,
      invoiceMetrics,
      referralMetrics,
      recentActivity,
      lastUpdated: new Date(),
    };
  }

  // Helper methods
  private buildDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    return filter;
  }

  private async getUserMetrics() {
    const [totalUsers, usersByRole, recentUsers] = await Promise.all([
      this.userModel.countDocuments(),
      this.getUsersByRole(),
      this.userModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
    ]);

    return {
      totalUsers,
      usersByRole,
      recentUsers,
    };
  }

  private async getUsersByRole() {
    return this.userModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { role: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getJobsByType(dateFilter: any) {
    return this.jobModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$jobType', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getTopEmployers(dateFilter: any) {
    return this.jobModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$employerId', jobCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employer' } },
      { $unwind: '$employer' },
      { $project: { employerName: '$employer.email', jobCount: 1 } },
      { $sort: { jobCount: -1 } },
      { $limit: 10 }
    ]);
  }

  private async getJobApplicationsByStatus(dateFilter: any) {
    return this.jobApplicationModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getRecentActivity() {
    const recentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      recentApplications,
      recentJobs,
      recentRecruitmentRequests,
      recentInvoices,
    ] = await Promise.all([
      this.applicationModel.countDocuments({ createdAt: { $gte: recentDate } }),
      this.jobModel.countDocuments({ createdAt: { $gte: recentDate } }),
      this.recruitmentRequestModel.countDocuments({ createdAt: { $gte: recentDate } }),
      this.invoiceModel.countDocuments({ createdAt: { $gte: recentDate } }),
    ]);

    return {
      recentApplications,
      recentJobs,
      recentRecruitmentRequests,
      recentInvoices,
    };
  }

  // Additional helper methods for new analytics
  private async getRecruitmentRequestsByStatus(dateFilter: any) {
    return this.recruitmentRequestModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getRecruitmentRequestsByServiceType(dateFilter: any) {
    return this.recruitmentRequestModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $project: { serviceType: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getRecruitmentCandidatesByStatus(dateFilter: any) {
    return this.recruitmentCandidateModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async calculateAverageTimeToFill(dateFilter: any): Promise<number> {
    const completedRequests = await this.recruitmentRequestModel.find({
      ...dateFilter,
      status: 'completed'
    });

    if (completedRequests.length === 0) return 0;

    const totalTime = completedRequests.reduce((sum, request) => {
      const requestWithTimestamps = request as unknown as TimestampedDocument;
      return sum + (requestWithTimestamps.updatedAt.getTime() - requestWithTimestamps.createdAt.getTime());
    }, 0);

    return totalTime / completedRequests.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  private async getInvoicesByStatus(dateFilter: any) {
    return this.invoiceModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getInvoicesByType(dateFilter: any) {
    return this.invoiceModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$invoiceType', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getTotalInvoiceAmount(dateFilter: any): Promise<number> {
    const result = await this.invoiceModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    return result[0]?.total || 0;
  }

  private async getPaidInvoiceAmount(dateFilter: any): Promise<number> {
    const result = await this.invoiceModel.aggregate([
      { $match: { ...dateFilter, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    return result[0]?.total || 0;
  }

  private async getAverageInvoiceValue(dateFilter: any): Promise<number> {
    const result = await this.invoiceModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, average: { $avg: '$totalAmount' } } }
    ]);
    return result[0]?.average || 0;
  }

  private async getReferralsByStatus(dateFilter: any) {
    return this.referralModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getRewardsByStatus(dateFilter: any) {
    return this.referralRewardModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  private async getTotalRewardValue(dateFilter: any): Promise<number> {
    const result = await this.referralRewardModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$rewardValue' } } }
    ]);
    return result[0]?.total || 0;
  }

  private async getPaidRewardValue(dateFilter: any): Promise<number> {
    const result = await this.referralRewardModel.aggregate([
      { $match: { ...dateFilter, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$rewardValue' } } }
    ]);
    return result[0]?.total || 0;
  }

  private async getTopReferrers(dateFilter: any) {
    return this.referralModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$referrerId', referralCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'referrer' } },
      { $unwind: '$referrer' },
      { $project: { referrerName: '$referrer.email', referralCount: 1 } },
      { $sort: { referralCount: -1 } },
      { $limit: 10 }
    ]);
  }
}
