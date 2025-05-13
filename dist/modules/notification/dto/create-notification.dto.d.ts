import { NotificationType } from "../notification.schema";
export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    data?: Record<string, any>;
    sendEmail?: boolean;
}
