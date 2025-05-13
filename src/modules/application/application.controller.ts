import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { ApplicationService } from "./application.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags("Applications")
@ApiBearerAuth()
@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all applications (Admin only)" })
  async findAll() {
    return this.applicationService.findAll();
  }

  @Get("my-applications")
  @ApiOperation({ summary: "Get current user's applications" })
  async getMyApplications(@Request() req: RequestWithUser) {
    if (req.user.role === UserRole.STUDENT) {
      return this.applicationService.findByStudent(req.user.userId);
    } else if (req.user.role === UserRole.EMPLOYER) {
      return this.applicationService.findByEmployer(req.user.userId);
    }
    throw new ForbiddenException("Access denied");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get application by ID" })
  async findOne(@Param("id") id: string, @Request() req: RequestWithUser) {
    const application = await this.applicationService.findOne(id);

    // Check if user has access to this application
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.SUPER_ADMIN &&
      application.studentId.toString() !== req.user.userId &&
      application.employerId.toString() !== req.user.userId
    ) {
      throw new ForbiddenException("Access denied");
    }

    return application;
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: "Create a new application" })
  async create(@Body() createApplicationDto: CreateApplicationDto, @Request() req: RequestWithUser) {
    return this.applicationService.create(req.user.userId, createApplicationDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an application" })
  async update(
    @Param("id") id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req: RequestWithUser
  ) {
    const application = await this.applicationService.findOne(id);

    // Check if user has permission to update
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.SUPER_ADMIN &&
      application.studentId.toString() !== req.user.userId &&
      application.employerId.toString() !== req.user.userId
    ) {
      throw new ForbiddenException("Access denied");
    }

    // Additional validation for employer-only fields
    if (
      req.user.role === UserRole.STUDENT &&
      (updateApplicationDto.interviewDate ||
       updateApplicationDto.interviewNotes ||
       updateApplicationDto.offerDetails)
    ) {
      throw new ForbiddenException("Students cannot update interview or offer details");
    }

    return this.applicationService.update(id, updateApplicationDto);
  }

  @Post(":id/documents/:documentId")
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: "Add a document to an application" })
  async addDocument(
    @Param("id") id: string,
    @Param("documentId") documentId: string,
    @Request() req: RequestWithUser
  ) {
    const application = await this.applicationService.findOne(id);

    // Check if user owns the application
    if (application.studentId.toString() !== req.user.userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.applicationService.addDocument(id, documentId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an application" })
  async delete(@Param("id") id: string, @Request() req: RequestWithUser) {
    const application = await this.applicationService.findOne(id);

    // Only admin or the student who created the application can delete it
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.SUPER_ADMIN &&
      application.studentId.toString() !== req.user.userId
    ) {
      throw new ForbiddenException("Access denied");
    }

    await this.applicationService.delete(id);
    return { message: "Application deleted successfully" };
  }
}
