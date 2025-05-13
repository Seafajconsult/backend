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
}
