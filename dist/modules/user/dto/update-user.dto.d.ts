import { UserRole } from '../user.schema';
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: UserRole;
}
