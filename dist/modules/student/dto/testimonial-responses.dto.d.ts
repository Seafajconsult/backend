export declare class TestimonialResponse {
    id: string;
    userId: string;
    content: string;
    videoUrl?: string;
    rating: number;
    status: string;
    createdAt: Date;
}
export declare class TestimonialListResponse {
    testimonials: TestimonialResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}
