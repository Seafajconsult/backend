export declare class ReferralCodeDto {
    referralCode?: string;
}
export declare class ReferralStatsResponseDto {
    totalReferrals: number;
    referredUsers: Array<{
        userId: string;
        email: string;
        createdAt: Date;
    }>;
    referredBy?: {
        userId: string;
        email: string;
    };
}
