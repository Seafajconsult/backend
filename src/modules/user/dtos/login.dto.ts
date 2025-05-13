import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
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
}
