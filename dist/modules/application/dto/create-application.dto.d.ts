declare class AcademicDetailsDto {
    highestQualification: string;
    institution: string;
    graduationYear: number;
    cgpa: number;
    englishTest?: EnglishTestDto;
}
declare class EnglishTestDto {
    type: string;
    score: number;
    dateOfTest: Date;
}
export declare class CreateApplicationDto {
    course: string;
    university: string;
    country: string;
    intake: string;
    academicDetails: AcademicDetailsDto;
    documents?: string[];
    additionalInformation?: string;
}
export {};
