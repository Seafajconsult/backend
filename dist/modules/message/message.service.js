"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./message.schema");
const conversation_schema_1 = require("./conversation.schema");
const user_service_1 = require("../user/user.service");
let MessageService = class MessageService {
    constructor(messageModel, conversationModel, userService) {
        this.messageModel = messageModel;
        this.conversationModel = conversationModel;
        this.userService = userService;
    }
    async findUserConversations(userId) {
        return this.conversationModel
            .find({ participants: userId, isActive: true })
            .populate('participants')
            .sort({ lastMessageAt: -1 })
            .exec();
    }
    async findConversation(id) {
        const conversation = await this.conversationModel
            .findById(id)
            .populate('participants')
            .exec();
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${id} not found`);
        }
        return conversation;
    }
    async findConversationMessages(conversationId, limit = 50, skip = 0) {
        return this.messageModel
            .find({ conversation: conversationId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender')
            .exec();
    }
    async createConversation(createConversationDto) {
        for (const participantId of createConversationDto.participants) {
            await this.userService.findById(participantId);
        }
        const existingConversation = await this.conversationModel.findOne({
            participants: { $all: createConversationDto.participants, $size: createConversationDto.participants.length },
            type: createConversationDto.type,
        });
        if (existingConversation) {
            if (!existingConversation.isActive) {
                existingConversation.isActive = true;
                await existingConversation.save();
            }
            return existingConversation;
        }
        const newConversation = new this.conversationModel({
            participants: createConversationDto.participants,
            type: createConversationDto.type,
            lastMessageAt: new Date(),
            metadata: createConversationDto.metadata || {},
        });
        return newConversation.save();
    }
    async createMessage(senderId, createMessageDto) {
        const conversation = await this.findConversation(createMessageDto.conversationId);
        if (!conversation.participants.some(p => p.toString() === senderId)) {
            throw new common_1.BadRequestException('Sender is not a participant in this conversation');
        }
        const newMessage = new this.messageModel({
            sender: senderId,
            conversation: createMessageDto.conversationId,
            content: createMessageDto.content,
            type: createMessageDto.type || message_schema_1.MessageType.TEXT,
            status: message_schema_1.MessageStatus.SENT,
            readBy: [senderId],
            metadata: createMessageDto.metadata || {},
        });
        conversation.lastMessageAt = new Date();
        await conversation.save();
        return newMessage.save();
    }
    async markMessageAsRead(messageId, userId) {
        const message = await this.messageModel.findById(messageId).exec();
        if (!message) {
            throw new common_1.NotFoundException(`Message with ID ${messageId} not found`);
        }
        const userIdObj = userId;
        if (!message.readBy.some(id => id.toString() === userId)) {
            message.readBy.push(userIdObj);
            const conversation = await this.findConversation(message.conversation.toString());
            if (message.readBy.length >= conversation.participants.length) {
                message.status = message_schema_1.MessageStatus.READ;
            }
            else {
                message.status = message_schema_1.MessageStatus.DELIVERED;
            }
            await message.save();
        }
        return message;
    }
    async deactivateConversation(id) {
        const conversation = await this.findConversation(id);
        conversation.isActive = false;
        return conversation.save();
    }
    async findConversationsByParticipants(participantIds, type) {
        const query = {
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
    async findUserConversationsByType(userId, type) {
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
    async findAllConversations() {
        return this.conversationModel
            .find()
            .populate('participants')
            .sort({ lastMessageAt: -1 })
            .exec();
    }
    async findConversationsByType(type) {
        return this.conversationModel
            .find({ type })
            .populate('participants')
            .sort({ lastMessageAt: -1 })
            .exec();
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(1, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        user_service_1.UserService])
], MessageService);
//# sourceMappingURL=message.service.js.map