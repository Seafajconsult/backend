import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum TestimonialType {
  TEXT = 'text',
  VIDEO = 'video'
}

export enum TestimonialStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Schema({ timestamps: true })
export class Testimonial extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, enum: TestimonialType })
  type: TestimonialType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string; // Text content or video URL

  @Prop({ type: Object })
  rating: {
    overall: number;
    support: number;
    communication: number;
    efficiency: number;
    professionalism: number;
  };

  @Prop()
  university?: string;

  @Prop()
  course?: string;

  @Prop()
  yearOfAdmission?: number;

  @Prop()
  thumbnailUrl?: string; // For video testimonials

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ enum: TestimonialStatus, default: TestimonialStatus.PENDING })
  status: TestimonialStatus;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likedBy: string[];

  @Prop({ default: false })
  featured: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  reviewedBy?: string;

  @Prop()
  reviewedAt?: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
