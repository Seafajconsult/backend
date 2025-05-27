import { StudentProfileService } from '../services/student-profile.service';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
export declare class StudentProfileController {
    private readonly studentProfileService;
    constructor(studentProfileService: StudentProfileService);
    getCurrentProfile(req: any): Promise<import("../schemas/student-profile.schema").StudentProfile>;
    updateProfile(req: any, updateProfileDto: UpdateStudentProfileDto): Promise<import("../schemas/student-profile.schema").StudentProfile>;
    getProfileCompletion(req: any): Promise<any>;
    getUpdateHistory(req: any): Promise<any>;
}
