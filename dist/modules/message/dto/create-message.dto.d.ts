import { MessageType } from "../message.schema";
export declare class CreateMessageDto {
    conversationId: string;
    content: string;
    type?: MessageType;
    metadata?: Record<string, any>;
}
