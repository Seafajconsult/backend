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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./chat.schema");
let ChatService = class ChatService {
    constructor(chatRoomModel, chatMessageModel) {
        this.chatRoomModel = chatRoomModel;
        this.chatMessageModel = chatMessageModel;
        this.connectedUsers = new Map();
    }
    async userConnected(userId, socketId) {
        this.connectedUsers.set(userId, socketId);
    }
    async userDisconnected(userId) {
        this.connectedUsers.delete(userId);
    }
    async createRoom(participants, isGroup = false, groupName) {
        return this.chatRoomModel.create({
            participants,
            isGroupChat: isGroup,
            groupName,
        });
    }
    async getRoomMessages(roomId, page = 1, limit = 50) {
        const messages = await this.chatMessageModel
            .find({ roomId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("senderId", "userId email role")
            .exec();
        return messages.reverse();
    }
    async createMessage(messageData) {
        const room = await this.chatRoomModel.findById(messageData.roomId);
        if (!room) {
            throw new common_1.NotFoundException("Chat room not found");
        }
        return this.chatMessageModel.create({
            ...messageData,
            readBy: [messageData.senderId],
        });
    }
    async markMessageAsRead(messageId, userId) {
        return this.chatMessageModel.findByIdAndUpdate(messageId, {
            $addToSet: { readBy: userId },
        }, { new: true });
    }
    async getUserRooms(userId) {
        return this.chatRoomModel
            .find({ participants: userId, isActive: true })
            .populate("participants", "userId email role")
            .exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.ChatRoom.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_schema_1.ChatMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map