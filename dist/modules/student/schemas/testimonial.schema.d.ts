import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare enum TestimonialType {
    TEXT = "text",
    VIDEO = "video"
}
export declare enum TestimonialStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Testimonial extends Document {
    userId: string;
    type: TestimonialType;
    title: string;
    content: string;
    rating: {
        overall: number;
        support: number;
        communication: number;
        efficiency: number;
        professionalism: number;
    };
    university?: string;
    course?: string;
    yearOfAdmission?: number;
    thumbnailUrl?: string;
    tags?: string[];
    status: TestimonialStatus;
    rejectionReason?: string;
    likes: number;
    likedBy: string[];
    featured: boolean;
    reviewedBy?: string;
    reviewedAt?: Date;
}
export declare const TestimonialSchema: mongoose.Schema<Testimonial, mongoose.Model<Testimonial, any, any, any, Document<unknown, any, Testimonial, any> & Testimonial & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Testimonial, Document<unknown, {}, mongoose.FlatRecord<Testimonial>, {}> & mongoose.FlatRecord<Testimonial> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
