import { Model } from 'mongoose';
import { StudentProfile } from '../schemas/student-profile.schema';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { NotificationService } from '../../notification/notification.service';
export declare class StudentProfileService {
    private studentProfileModel;
    private readonly notificationService;
    constructor(studentProfileModel: Model<StudentProfile>, notificationService: NotificationService);
    private calculateCompletionPercentage;
    findByUserId(userId: string): Promise<StudentProfile>;
    update(userId: string, updateDto: UpdateStudentProfileDto): Promise<StudentProfile>;
    getProfileCompletionStatus(userId: string): Promise<{
        completionStatus: {
            personalInfo: boolean;
            contactInfo: boolean;
            emergencyContact: boolean;
            education: boolean;
            testScores: boolean;
            workExperience: boolean;
            documents: boolean;
        };
        completionPercentage: number;
    }>;
    getProfileUpdateHistory(userId: string): Promise<{
        field: string;
        oldValue: any;
        newValue: any;
        updatedAt: Date;
        updatedBy: string;
    }[]>;
}
