export declare class ProfileCompletionResponse {
    completionPercentage: number;
}
export declare class ProfileUpdateHistoryItem {
    updatedAt: Date;
    updatedFields: string[];
    previousValues: Record<string, any>;
}
export declare class ProfileUpdateHistoryResponse {
    updates: ProfileUpdateHistoryItem[];
}
