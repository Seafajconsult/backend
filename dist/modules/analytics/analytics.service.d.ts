import { Model } from "mongoose";
import { Analytics } from "./analytics.schema";
import { Application, ApplicationStatus } from "../application/application.schema";
import { Document as MongooseDocument } from "mongoose";
import { Payment, PaymentType } from "../payment/payment.schema";
import { ReportQueryDto } from "./dto/report-query.dto";
import { Message } from "../message/message.schema";
import { UserDocument } from "../document/document.schema";
import { User } from "../user/user.schema";
export declare class AnalyticsService {
    private analyticsModel;
    private applicationModel;
    private paymentModel;
    private messageModel;
    private documentModel;
    private userModel;
    constructor(analyticsModel: Model<Analytics>, applicationModel: Model<Application>, paymentModel: Model<Payment>, messageModel: Model<Message>, documentModel: Model<UserDocument>, userModel: Model<User>);
    generateCustomReport(reportQuery: ReportQueryDto): Promise<string | Buffer<ArrayBuffer> | {
        totalApplications: number;
        statusDistribution: Record<ApplicationStatus, number>;
        completionRate: number;
        averageProcessingTime: number;
    } | {
        totalRevenue: number;
        revenueByType: Record<PaymentType, number>;
        averageTransactionValue: number;
        transactionCount: number;
    } | {
        newApplications: number;
        messagesSent: number;
        documentsUploaded: number;
        engagementScore: number;
    } | {
        totalDocuments: number;
        verifiedDocuments: number;
        rejectedDocuments: number;
        verificationRate: number;
        averageVerificationTime: number;
    }>;
    private getReportData;
    private generateCSV;
    private generatePDF;
    generateDailyAnalytics(): Promise<MongooseDocument<unknown, {}, Analytics, {}> & Analytics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<(MongooseDocument<unknown, {}, Analytics, {}> & Analytics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    private calculateDailyMetrics;
    getDashboardMetrics(): Promise<{
        currentMetrics: {};
        totalUsers: number;
        activeApplications: number;
        monthlyRevenue: number;
        lastUpdated: Date;
    }>;
    getMetricTrends(metric: string, period: "daily" | "weekly" | "monthly"): Promise<{
        date: Date;
        value: number;
    }[]>;
    private getStartDateForPeriod;
    private aggregateMetricsByPeriod;
    private getApplicationMetrics;
    private getRevenueAnalysis;
    private getUserEngagementMetrics;
    private getDocumentVerificationMetrics;
    private getUserCount;
    private getActiveApplicationsCount;
    private getMonthlyRevenue;
    private calculateEngagementScore;
    private calculateAverageProcessingTime;
    private calculateAverageVerificationTime;
}
