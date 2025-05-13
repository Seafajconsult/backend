import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    getMyConversations(req: RequestWithUser): Promise<import("./conversation.schema").Conversation[]>;
    getConversation(id: string, req: RequestWithUser): Promise<import("./conversation.schema").Conversation>;
    getConversationMessages(id: string, limit: number, skip: number, req: RequestWithUser): Promise<import("./message.schema").Message[]>;
    createConversation(createConversationDto: CreateConversationDto, req: RequestWithUser): Promise<import("./conversation.schema").Conversation>;
    sendMessage(createMessageDto: CreateMessageDto, req: RequestWithUser): Promise<import("./message.schema").Message>;
    markAsRead(id: string, req: RequestWithUser): Promise<import("./message.schema").Message>;
    deactivateConversation(id: string, req: RequestWithUser): Promise<import("./conversation.schema").Conversation>;
}
