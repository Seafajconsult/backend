import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

@Schema({ timestamps: true })
export class ChatRoom extends Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  participants: string[];

  @Prop({ default: false })
  isGroupChat: boolean;

  @Prop()
  groupName?: string;

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  })
  roomId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  readBy: string[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
