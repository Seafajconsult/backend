import { IsNotEmpty, IsString, IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplicationDto {
  @ApiProperty({
    description: "ID of the employer",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  employerId: string;

  @ApiProperty({
    description: "Position being applied for",
    example: "Software Engineer Intern",
  })
  @IsNotEmpty()
  @IsString()
  position: string;
}
