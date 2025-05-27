import { UserService } from './user.service';
import { NotificationService } from '../../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../schemas/user.schema';
export declare class ReferralService {
    private readonly userService;
    private readonly notificationService;
    private readonly configService;
    private referralBonusAmount;
    constructor(userService: UserService, notificationService: NotificationService, configService: ConfigService);
    processReferral(referrer: User, referredUser: User): Promise<void>;
    validateReferralCode(referralCode: string): Promise<User>;
    getReferralStats(userId: string): Promise<any>;
}
