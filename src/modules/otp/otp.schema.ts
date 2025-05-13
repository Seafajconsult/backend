import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class OTP extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

// Add TTL index for automatic document expiration
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
