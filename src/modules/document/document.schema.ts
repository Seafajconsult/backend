import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum DocumentType {
  PASSPORT = "passport",
  TRANSCRIPT = "transcript",
  TEST_SCORE = "test_score",
  OFFER_LETTER = "offer_letter",
  OTHER = "other",
}

export enum DocumentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  cloudinaryId: string;

  @Prop({ required: true })
  cloudinaryUrl: string;

  @Prop({ required: true, enum: DocumentType })
  documentType: DocumentType;

  @Prop({
    required: true,
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Prop()
  rejectionReason?: string;
}

export const UserDocumentSchema = SchemaFactory.createForClass(UserDocument);
