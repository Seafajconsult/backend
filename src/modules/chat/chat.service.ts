import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatRoom, ChatMessage } from "./chat.schema";

@Injectable()
export class ChatService {
  private connectedUsers = new Map<string, string>();

  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>,
  ) {}

  async userConnected(userId: string, socketId: string) {
    this.connectedUsers.set(userId, socketId);
  }

  async userDisconnected(userId: string) {
    this.connectedUsers.delete(userId);
  }

  async createRoom(
    participants: string[],
    isGroup = false,
    groupName?: string,
  ) {
    return this.chatRoomModel.create({
      participants,
      isGroupChat: isGroup,
      groupName,
    });
  }

  async getRoomMessages(roomId: string, page = 1, limit = 50) {
    const messages = await this.chatMessageModel
      .find({ roomId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "userId email role")
      .exec();

    return messages.reverse();
  }

  async createMessage(messageData: {
    roomId: string;
    senderId: string;
    content: string;
  }) {
    const room = await this.chatRoomModel.findById(messageData.roomId);
    if (!room) {
      throw new NotFoundException("Chat room not found");
    }

    return this.chatMessageModel.create({
      ...messageData,
      readBy: [messageData.senderId],
    });
  }

  async markMessageAsRead(messageId: string, userId: string) {
    return this.chatMessageModel.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { readBy: userId },
      },
      { new: true },
    );
  }

  async getUserRooms(userId: string) {
    return this.chatRoomModel
      .find({ participants: userId, isActive: true })
      .populate("participants", "userId email role")
      .exec();
  }
}
