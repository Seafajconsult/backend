import { StudentStatus } from '../../user/schemas/student-profile.schema';
export declare class CreateStudentProfileDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    nationality: string;
    currentAddress: string;
    status?: StudentStatus;
    preferredCountries: string[];
    preferredCourses: string[];
    highestEducation: string;
    currentInstitution?: string;
    graduationYear?: number;
    englishTestType?: string;
    englishTestScore?: number;
}
