import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: "registration" | "password-reset";
  expiry: Date;
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, enum: ["registration", "password-reset"] })
  purpose: string;

  @Prop({ required: true })
  expiry: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Add TTL index to automatically remove expired OTPs
OtpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });
