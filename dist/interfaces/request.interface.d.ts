import { Request } from 'express';
import { UserRole } from '../modules/user/user.schema';
export interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        role: UserRole;
    };
}
