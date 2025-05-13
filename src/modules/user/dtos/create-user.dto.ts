import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../interfaces/user.interface";

export class CreateUserDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: "User password (min 8 characters)",
    example: "StrongP@ssw0rd",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @ApiProperty({
    description: "User role (student or employer)",
    enum: [UserRole.STUDENT, UserRole.EMPLOYER],
    example: UserRole.STUDENT,
  })
  @IsEnum([UserRole.STUDENT, UserRole.EMPLOYER])
  @IsNotEmpty()
  readonly role: UserRole;
}
