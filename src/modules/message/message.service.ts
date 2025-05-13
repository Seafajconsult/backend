import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageType, MessageStatus } from "./message.schema";
import { Conversation, ConversationType } from "./conversation.schema";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UserService } from "../user/user.service";
import { User } from "../user/user.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private userService: UserService,
  ) {}

  async findUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({ participants: userId, isActive: true })
      .populate('participants')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async findConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('participants')
      .exec();

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async findConversationMessages(conversationId: string, limit = 50, skip = 0): Promise<Message[]> {
    return this.messageModel
      .find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender')
      .exec();
  }

  async createConversation(createConversationDto: CreateConversationDto): Promise<Conversation> {
    // Verify all participants exist
    for (const participantId of createConversationDto.participants) {
      await this.userService.findById(participantId);
    }

    // Check if conversation already exists between these participants
    const existingConversation = await this.conversationModel.findOne({
      participants: { $all: createConversationDto.participants, $size: createConversationDto.participants.length },
      type: createConversationDto.type,
    });

    if (existingConversation) {
      // Reactivate if it was inactive
      if (!existingConversation.isActive) {
        existingConversation.isActive = true;
        await existingConversation.save();
      }
      return existingConversation;
    }

    // Create new conversation
    const newConversation = new this.conversationModel({
      participants: createConversationDto.participants,
      type: createConversationDto.type,
      lastMessageAt: new Date(),
      metadata: createConversationDto.metadata || {},
    });

    return newConversation.save();
  }

  async createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    // Verify conversation exists
    const conversation = await this.findConversation(createMessageDto.conversationId);

    // Verify sender is a participant
    if (!conversation.participants.some(p => p.toString() === senderId)) {
      throw new BadRequestException('Sender is not a participant in this conversation');
    }

    // Create message
    const newMessage = new this.messageModel({
      sender: senderId,
      conversation: createMessageDto.conversationId,
      content: createMessageDto.content,
      type: createMessageDto.type || MessageType.TEXT,
      status: MessageStatus.SENT,
      readBy: [senderId], // Sender has read the message
      metadata: createMessageDto.metadata || {},
    });

    // Update conversation lastMessageAt
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return newMessage.save();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId).exec();

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Add user to readBy if not already there
    const userIdObj = userId as unknown as User;
    if (!message.readBy.some(id => id.toString() === userId)) {
      message.readBy.push(userIdObj);

      // Update status if all participants have read the message
      const conversation = await this.findConversation(message.conversation.toString());
      if (message.readBy.length >= conversation.participants.length) {
        message.status = MessageStatus.READ;
      } else {
        message.status = MessageStatus.DELIVERED;
      }

      await message.save();
    }

    return message;
  }

  async deactivateConversation(id: string): Promise<Conversation> {
    const conversation = await this.findConversation(id);

    conversation.isActive = false;
    return conversation.save();
  }

  async findConversationsByParticipants(
    participantIds: string[],
    type?: ConversationType
  ): Promise<Conversation[]> {
    const query: any = {
      participants: { $all: participantIds },
      isActive: true
    };

    if (type) {
      query.type = type;
    }

    return this.conversationModel
      .find(query)
      .populate('participants')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async findUserConversationsByType(
    userId: string,
    type: ConversationType
  ): Promise<Conversation[]> {
    return this.conversationModel
      .find({
        participants: userId,
        type,
        isActive: true
      })
      .populate('participants')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async findAllConversations(): Promise<Conversation[]> {
    return this.conversationModel
      .find()
      .populate('participants')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async findConversationsByType(type: ConversationType): Promise<Conversation[]> {
    return this.conversationModel
      .find({ type })
      .populate('participants')
      .sort({ lastMessageAt: -1 })
      .exec();
  }
}
