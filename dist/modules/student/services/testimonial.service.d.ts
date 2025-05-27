import { Model } from 'mongoose';
import { Testimonial } from '../schemas/testimonial.schema';
import { CreateTestimonialDto } from '../dto/testimonial.dto';
import { TestimonialStatus } from '../enums/testimonial-status.enum';
export declare class TestimonialService {
    private testimonialModel;
    constructor(testimonialModel: Model<Testimonial>);
    create(userId: string, createTestimonialDto: CreateTestimonialDto): Promise<Testimonial>;
    findAll({ page, limit, status }: {
        page: number;
        limit: number;
        status?: TestimonialStatus;
    }): Promise<{
        testimonials: (import("mongoose").Document<unknown, {}, Testimonial, {}> & Testimonial & Required<{
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
    findByUserId(userId: string): Promise<Testimonial[]>;
    findById(id: string): Promise<Testimonial>;
    updateStatus(id: string, status: TestimonialStatus, rejectionReason?: string): Promise<Testimonial>;
    delete(userId: string, id: string): Promise<boolean>;
}
