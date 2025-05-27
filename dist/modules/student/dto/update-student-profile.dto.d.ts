import { Gender, MaritalStatus } from '../schemas/student-profile.schema';
declare class AddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}
declare class EmergencyContactDto {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
}
declare class EducationDto {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date;
    gpa: number;
    country: string;
}
declare class TestScoreDto {
    type: string;
    score: number;
    dateOfTest: Date;
    expiryDate: Date;
}
declare class WorkExperienceDto {
    company: string;
    position: string;
    startDate: Date;
    endDate: Date;
    description: string;
    country: string;
}
declare class PreferencesDto {
    preferredStudyCountries: string[];
    preferredStudyLevel: string;
    budgetRange: {
        min: number;
        max: number;
        currency: string;
    };
    intakePreference: string[];
}
export declare class UpdateStudentProfileDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    maritalStatus?: MaritalStatus;
    nationality?: string;
    passportNumber?: string;
    passportExpiryDate?: Date;
    phone?: string;
    alternativeEmail?: string;
    address?: AddressDto;
    emergencyContact?: EmergencyContactDto;
    education?: EducationDto[];
    testScores?: TestScoreDto[];
    workExperience?: WorkExperienceDto[];
    preferences?: PreferencesDto;
}
export {};
