import { TestimonialStatus } from '../enums/testimonial-status.enum';
export declare class CreateTestimonialDto {
    content: string;
    videoUrl?: string;
    rating: number;
}
export declare class UpdateTestimonialStatusDto {
    status: TestimonialStatus;
    rejectionReason?: string;
}
export declare class TestimonialQueryParams {
    page: number;
    limit: number;
    status?: TestimonialStatus;
}
