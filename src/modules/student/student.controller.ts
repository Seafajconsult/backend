import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { DocumentService } from "../document/document.service";
import { PaymentService } from "../payment/payment.service";
import { MessageService } from "../message/message.service";
import { NotificationService } from "../notification/notification.service";
import { ApplicationService } from "../application/application.service";
import { ConversationType } from "../message/conversation.schema";
import { NotFoundException } from "@nestjs/common";
import { RegisterDto } from "../auth/dto/register.dto";
import { VerifyOtpDto } from "../auth/dto/verify-otp.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { CreateDocumentDto } from "../document/dto/create-document.dto";
import { CreateMessageDto } from "../message/dto/create-message.dto";
import { CreateApplicationDto } from "../application/dto/create-application.dto";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private readonly paymentService: PaymentService,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly applicationService: ApplicationService,
  ) {}

  // Auth endpoints
  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new student account' })
  @ApiResponse({ status: 201, description: 'Student account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    // Override the role to ensure it's always STUDENT
    const studentDto = { ...registerDto, role: UserRole.STUDENT };
    return this.authService.register(studentDto);
  }

  @Post('auth/verify-otp')
  @ApiOperation({ summary: 'Verify student email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyEmail(verifyOtpDto.userId, verifyOtpDto.otp);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Student login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // Document endpoints
  @Post('documents/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or document type' })
  @ApiBody({
    description: 'Document file upload with type',
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

  @Get('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all documents for the current student' })
  @ApiResponse({ status: 200, description: 'Returns all documents' })
  async getMyDocuments(@Request() req: RequestWithUser) {
    return this.documentService.getUserDocuments(req.user.userId);
  }

  // Admin messaging endpoints
  @Post('messages/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start or continue a conversation with an admin' })
  @ApiResponse({ status: 201, description: 'Conversation created or retrieved successfully' })
  @ApiBody({
    description: 'Message to send to admin',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Hello, I need help with my application.'
        }
      }
    }
  })
  async messageAdmin(
    @Request() req: RequestWithUser,
    @Body('content') content: string
  ) {
    // Find an admin to message or use an existing conversation
    const adminUsers = await this.userService.findByRole(UserRole.ADMIN);
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No admin users available');
    }

    // For simplicity, use the first admin
    const adminUser = adminUsers[0];

    // Check for existing conversation
    const existingConversations = await this.messageService.findConversationsByParticipants(
      [req.user.userId, adminUser.userId],
      ConversationType.STUDENT_ADMIN
    );

    let conversation;
    if (existingConversations.length > 0) {
      // Use existing conversation
      conversation = existingConversations[0];
    } else {
      // Create new conversation
      conversation = await this.messageService.createConversation({
        participants: [req.user.userId, adminUser.userId],
        type: ConversationType.STUDENT_ADMIN
      });
    }

    // Send message
    const message = await this.messageService.createMessage(req.user.userId, {
      conversationId: conversation._id.toString(),
      content
    });

    return {
      conversation,
      message
    };
  }

  @Get('messages/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin conversation messages' })
  @ApiResponse({ status: 200, description: 'Returns admin conversation messages' })
  async getAdminMessages(@Request() req: RequestWithUser) {
    // Find conversations with admins
    const adminConversations = await this.messageService.findUserConversationsByType(
      req.user.userId,
      ConversationType.STUDENT_ADMIN
    );

    if (adminConversations.length === 0) {
      return { conversations: [], messages: [] };
    }

    // Get messages from the most recent conversation
    const latestConversation = adminConversations[0];
    const messages = await this.messageService.findConversationMessages(
      latestConversation._id.toString(),
      50,
      0
    );

    return {
      conversation: latestConversation,
      messages
    };
  }
}
