export declare enum ReportType {
    APPLICATION_METRICS = "application_metrics",
    REVENUE_ANALYSIS = "revenue_analysis",
    USER_ENGAGEMENT = "user_engagement",
    DOCUMENT_VERIFICATION = "document_verification"
}
export declare enum ReportFormat {
    JSON = "json",
    CSV = "csv",
    PDF = "pdf"
}
export declare class ReportQueryDto {
    type: ReportType;
    startDate: string;
    endDate: string;
    format: ReportFormat;
    metrics?: string[];
}
