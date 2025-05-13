import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../user/user.schema";
export declare enum ConversationType {
    STUDENT_ADVISOR = "student_advisor",
    STUDENT_EMPLOYER = "student_employer",
    STUDENT_ADMIN = "student_admin",
    EMPLOYER_ADMIN = "employer_admin",
    SUPPORT = "support"
}
export declare class Conversation extends Document {
    participants: User[];
    type: ConversationType;
    isActive: boolean;
    lastMessageAt: Date;
    metadata: Record<string, any>;
}
export declare const ConversationSchema: MongooseSchema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation, any> & Conversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>, {}> & import("mongoose").FlatRecord<Conversation> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
