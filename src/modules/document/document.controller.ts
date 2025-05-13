import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  Request,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { DocumentService } from "./document.service";
import { DocumentType, DocumentStatus } from "./document.schema";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentStatusDto } from "./dto/update-document-status.dto";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { RequestWithUser } from "../../interfaces/request.interface";

@Controller("documents")
@UseGuards(JwtAuthGuard)
@ApiTags("Documents")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Document file upload with type",
    type: CreateDocumentDto,
  })
  async uploadDocument(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.documentService.uploadDocument(
      req.user.userId,
      file,
      createDocumentDto.documentType,
    );
  }

  @Get()
  async getMyDocuments(@Request() req: RequestWithUser) {
    return this.documentService.getUserDocuments(req.user.userId);
  }

  @Get("user/:userId")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getUserDocuments(@Param("userId") userId: string) {
    return this.documentService.getUserDocuments(userId);
  }

  @Post(":id/status")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateDocumentStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateDocumentStatusDto,
  ) {
    return this.documentService.updateDocumentStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.rejectionReason,
    );
  }

  @Delete(":id")
  async deleteDocument(@Param("id") id: string, @Request() req: RequestWithUser) {
    // Check if user is admin or document owner
    const document = await this.documentService.findDocumentById(id);
    if (
      document.userId.toString() !== req.user.userId &&
      ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req.user.role)
    ) {
      throw new Error("Unauthorized to delete this document");
    }

    return this.documentService.deleteDocument(id);
  }
}
