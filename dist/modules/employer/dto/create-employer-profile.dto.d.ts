import { EmployerStatus, SubscriptionTier } from '../../user/schemas/employer-profile.schema';
export declare class CreateEmployerProfileDto {
    companyName: string;
    businessRegistrationNumber: string;
    contactPersonName: string;
    contactPersonPosition: string;
    phoneNumber: string;
    industry: string;
    companySize: string;
    address: string;
    website?: string;
    status?: EmployerStatus;
    subscriptionTier?: SubscriptionTier;
}
