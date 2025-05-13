import { Model } from "mongoose";
import { Message } from "./message.schema";
import { Conversation, ConversationType } from "./conversation.schema";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UserService } from "../user/user.service";
export declare class MessageService {
    private messageModel;
    private conversationModel;
    private userService;
    constructor(messageModel: Model<Message>, conversationModel: Model<Conversation>, userService: UserService);
    findUserConversations(userId: string): Promise<Conversation[]>;
    findConversation(id: string): Promise<Conversation>;
    findConversationMessages(conversationId: string, limit?: number, skip?: number): Promise<Message[]>;
    createConversation(createConversationDto: CreateConversationDto): Promise<Conversation>;
    createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<Message>;
    markMessageAsRead(messageId: string, userId: string): Promise<Message>;
    deactivateConversation(id: string): Promise<Conversation>;
    findConversationsByParticipants(participantIds: string[], type?: ConversationType): Promise<Conversation[]>;
    findUserConversationsByType(userId: string, type: ConversationType): Promise<Conversation[]>;
    findAllConversations(): Promise<Conversation[]>;
    findConversationsByType(type: ConversationType): Promise<Conversation[]>;
}
