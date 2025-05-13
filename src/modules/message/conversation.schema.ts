import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../user/user.schema";

export enum ConversationType {
  STUDENT_ADVISOR = "student_advisor",
  STUDENT_EMPLOYER = "student_employer",
  STUDENT_ADMIN = "student_admin",
  EMPLOYER_ADMIN = "employer_admin",
  SUPPORT = "support",
}

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], required: true })
  participants: User[];

  @Prop({ enum: ConversationType, required: true })
  type: ConversationType;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastMessageAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
