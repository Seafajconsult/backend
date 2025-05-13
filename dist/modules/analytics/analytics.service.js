"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const analytics_schema_1 = require("./analytics.schema");
const application_schema_1 = require("../application/application.schema");
const payment_schema_1 = require("../payment/payment.schema");
const report_query_dto_1 = require("./dto/report-query.dto");
const message_schema_1 = require("../message/message.schema");
const document_schema_1 = require("../document/document.schema");
const user_schema_1 = require("../user/user.schema");
const PDFDocument = require("pdfkit");
const json2csv_1 = require("json2csv");
let AnalyticsService = class AnalyticsService {
    constructor(analyticsModel, applicationModel, paymentModel, messageModel, documentModel, userModel) {
        this.analyticsModel = analyticsModel;
        this.applicationModel = applicationModel;
        this.paymentModel = paymentModel;
        this.messageModel = messageModel;
        this.documentModel = documentModel;
        this.userModel = userModel;
    }
    async generateCustomReport(reportQuery) {
        const data = await this.getReportData(reportQuery);
        switch (reportQuery.format) {
            case report_query_dto_1.ReportFormat.CSV:
                return this.generateCSV(data);
            case report_query_dto_1.ReportFormat.PDF:
                return this.generatePDF(data);
            default:
                return data;
        }
    }
    async getReportData(reportQuery) {
        const { startDate, endDate, type } = reportQuery;
        switch (type) {
            case report_query_dto_1.ReportType.APPLICATION_METRICS:
                return this.getApplicationMetrics(startDate, endDate);
            case report_query_dto_1.ReportType.REVENUE_ANALYSIS:
                return this.getRevenueAnalysis(startDate, endDate);
            case report_query_dto_1.ReportType.USER_ENGAGEMENT:
                return this.getUserEngagementMetrics(startDate, endDate);
            case report_query_dto_1.ReportType.DOCUMENT_VERIFICATION:
                return this.getDocumentVerificationMetrics(startDate, endDate);
            default:
                throw new Error("Invalid report type");
        }
    }
    generateCSV(data) {
        const parser = new json2csv_1.Parser();
        return parser.parse(data);
    }
    generatePDF(data) {
        const doc = new PDFDocument();
        const buffers = [];
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
    async getAnalyticsByDateRange(startDate, endDate) {
        return this.analyticsModel
            .find({
            date: { $gte: startDate, $lte: endDate },
        })
            .sort({ date: 1 });
    }
    async calculateDailyMetrics(date) {
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
        const [recentAnalytics, totalUsers, activeApplications, monthlyRevenue] = await Promise.all([
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
    async getMetricTrends(metric, period) {
        const endDate = new Date();
        const startDate = this.getStartDateForPeriod(period);
        const analytics = await this.analyticsModel
            .find({
            date: { $gte: startDate, $lte: endDate },
        })
            .sort({ date: 1 });
        return this.aggregateMetricsByPeriod(analytics, metric, period);
    }
    getStartDateForPeriod(period) {
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
    aggregateMetricsByPeriod(analytics, metric, period) {
        return analytics.map((record) => ({
            date: record.date,
            value: record.metrics[metric] || 0,
        }));
    }
    async getApplicationMetrics(startDate, endDate) {
        const applications = await this.applicationModel.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        const totalApplications = applications.length;
        const statusCounts = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});
        const completionRate = ((statusCounts["completed"] || 0) / totalApplications) * 100;
        return {
            totalApplications,
            statusDistribution: statusCounts,
            completionRate,
            averageProcessingTime: await this.calculateAverageProcessingTime(startDate, endDate),
        };
    }
    async getRevenueAnalysis(startDate, endDate) {
        const payments = await this.paymentModel.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: "completed",
        });
        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const initialRevenueByType = {
            [payment_schema_1.PaymentType.APPLICATION_FEE]: 0,
            [payment_schema_1.PaymentType.SERVICE_CHARGE]: 0,
            [payment_schema_1.PaymentType.CONSULTATION_FEE]: 0,
        };
        const revenueByType = payments.reduce((acc, payment) => {
            acc[payment.paymentType] =
                (acc[payment.paymentType] || 0) + payment.amount;
            return acc;
        }, initialRevenueByType);
        return {
            totalRevenue,
            revenueByType,
            averageTransactionValue: totalRevenue / payments.length,
            transactionCount: payments.length,
        };
    }
    async getUserEngagementMetrics(startDate, endDate) {
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
            engagementScore: this.calculateEngagementScore(applications, messages, documents),
        };
    }
    async getDocumentVerificationMetrics(startDate, endDate) {
        const documents = await this.documentModel.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        const totalDocuments = documents.length;
        const verifiedDocuments = documents.filter((doc) => doc.status === "approved").length;
        const rejectedDocuments = documents.filter((doc) => doc.status === "rejected").length;
        return {
            totalDocuments,
            verifiedDocuments,
            rejectedDocuments,
            verificationRate: (verifiedDocuments / totalDocuments) * 100,
            averageVerificationTime: await this.calculateAverageVerificationTime(),
        };
    }
    async getUserCount() {
        return this.userModel.countDocuments();
    }
    async getActiveApplicationsCount() {
        return this.applicationModel.countDocuments({
            status: { $nin: ["completed", "cancelled"] },
        });
    }
    async getMonthlyRevenue(startDate, endDate) {
        const payments = await this.paymentModel.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: "completed",
        });
        return payments.reduce((sum, payment) => sum + payment.amount, 0);
    }
    calculateEngagementScore(applications, messages, documents) {
        const weights = {
            applications: 0.4,
            messages: 0.3,
            documents: 0.3,
        };
        return (applications * weights.applications +
            messages * weights.messages +
            documents * weights.documents);
    }
    async calculateAverageProcessingTime(startDate, endDate) {
        const completedApplications = await this.applicationModel.find({
            status: application_schema_1.ApplicationStatus.COMPLETED,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        if (completedApplications.length === 0)
            return 0;
        const totalTime = completedApplications.reduce((sum, app) => {
            const appWithTimestamps = app;
            return (sum +
                (appWithTimestamps.updatedAt.getTime() -
                    appWithTimestamps.createdAt.getTime()));
        }, 0);
        return totalTime / completedApplications.length / (1000 * 60 * 60);
    }
    async calculateAverageVerificationTime() {
        const documents = await this.documentModel.find({
            status: { $in: ["approved", "rejected"] },
        });
        if (documents.length === 0)
            return 0;
        const totalTime = documents.reduce((sum, doc) => {
            const docWithTimestamps = doc;
            return (sum +
                (docWithTimestamps.updatedAt.getTime() -
                    docWithTimestamps.createdAt.getTime()));
        }, 0);
        return totalTime / documents.length / (1000 * 60 * 60);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(analytics_schema_1.Analytics.name)),
    __param(1, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(3, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(4, (0, mongoose_1.InjectModel)(document_schema_1.UserDocument.name)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map