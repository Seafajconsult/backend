import { ApplicationStatus } from "../application.schema";
declare class OfferDetailsDto {
    salary: number;
    startDate: Date;
    benefits: string[];
}
export declare class UpdateApplicationDto {
    position?: string;
    status?: ApplicationStatus;
    interviewDate?: Date;
    interviewNotes?: string;
    offerDetails?: OfferDetailsDto;
}
export {};
