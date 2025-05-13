import { ConversationType } from "../conversation.schema";
export declare class CreateConversationDto {
    participants: string[];
    type: ConversationType;
    metadata?: Record<string, any>;
}
