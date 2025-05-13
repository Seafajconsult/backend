import { UserRole } from "../interfaces/user.interface";
export declare class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;
}
