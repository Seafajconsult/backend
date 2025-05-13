import { AnalyticsService } from "./analytics.service";
import { ReportQueryDto } from "./dto/report-query.dto";
import { Response } from "express";
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDailyAnalytics(): Promise<import("mongoose").Document<unknown, {}, import("./analytics.schema").Analytics, {}> & import("./analytics.schema").Analytics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAnalyticsByDateRange(startDate: string, endDate: string): Promise<(import("mongoose").Document<unknown, {}, import("./analytics.schema").Analytics, {}> & import("./analytics.schema").Analytics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    generateReport(reportQuery: ReportQueryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getDashboardMetrics(): Promise<{
        currentMetrics: {};
        totalUsers: number;
        activeApplications: number;
        monthlyRevenue: number;
        lastUpdated: Date;
    }>;
    getTrends(metric: string, period?: "daily" | "weekly" | "monthly"): Promise<{
        date: Date;
        value: number;
    }[]>;
}
