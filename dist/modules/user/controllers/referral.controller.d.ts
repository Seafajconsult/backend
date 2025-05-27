import { UserService } from '../services/user.service';
import { NotificationService } from '../../notification/notification.service';
import { ReferralCodeDto } from '../dto/referral.dto';
import { RequestWithUser } from '../../../interfaces/request.interface';
export declare class ReferralController {
    private readonly userService;
    private readonly notificationService;
    constructor(userService: UserService, notificationService: NotificationService);
    getReferralStats(req: RequestWithUser): Promise<any>;
    getReferralCode(req: RequestWithUser): Promise<{
        referralCode: any;
    }>;
    validateReferralCode(referralCodeDto: ReferralCodeDto): Promise<{
        isValid: boolean;
        referrerName: string;
    }>;
}
