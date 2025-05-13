import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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

@Schema()
export class Analytics extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ type: Object, required: true })
  metrics: AnalyticsMetrics;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
