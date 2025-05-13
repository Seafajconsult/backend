import { Document } from "mongoose";
export interface AnalyticsMetrics {
    totalUsers: number;
    activeUsers: number;
    totalApplications: number;
    completedApplications: number;
    pendingVerifications: number;
    totalRevenue: number;
    [key: string]: number;
}
export declare class Analytics extends Document {
    date: Date;
    metrics: AnalyticsMetrics;
    metadata?: Record<string, any>;
}
export declare const AnalyticsSchema: import("mongoose").Schema<Analytics, import("mongoose").Model<Analytics, any, any, any, Document<unknown, any, Analytics, any> & Analytics & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Analytics, Document<unknown, {}, import("mongoose").FlatRecord<Analytics>, {}> & import("mongoose").FlatRecord<Analytics> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
