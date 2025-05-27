import { PartialType } from "@nestjs/swagger";
import { CreateJobDto } from "./create-job.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { JobStatus } from "../job.schema";

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiProperty({ description: "Job status", enum: JobStatus, required: false })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}
