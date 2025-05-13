import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserRole } from "../../user/user.schema";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
