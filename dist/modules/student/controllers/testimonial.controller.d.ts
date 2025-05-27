import { TestimonialService } from '../services/testimonial.service';
import { CreateTestimonialDto, UpdateTestimonialStatusDto, TestimonialQueryParams } from '../dto/testimonial.dto';
export declare class TestimonialController {
    private readonly testimonialService;
    constructor(testimonialService: TestimonialService);
    create(req: any, createTestimonialDto: CreateTestimonialDto): Promise<import("../schemas/testimonial.schema").Testimonial>;
    findAll(query: TestimonialQueryParams): Promise<{
        testimonials: (import("mongoose").Document<unknown, {}, import("../schemas/testimonial.schema").Testimonial, {}> & import("../schemas/testimonial.schema").Testimonial & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    findUserTestimonials(req: any): Promise<import("../schemas/testimonial.schema").Testimonial[]>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateTestimonialStatusDto): Promise<import("../schemas/testimonial.schema").Testimonial>;
    remove(req: any, id: string): Promise<boolean>;
}
