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
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery
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
import { ApplicationService } from "../application/application.service";
import { LoginDto } from "../auth/dto/login.dto";
import { UpdateDocumentStatusDto } from "../document/dto/update-document-status.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
import { ConversationType } from "../message/conversation.schema";

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private readonly paymentService: PaymentService,
    private readonly messageService: MessageService,
    private readonly applicationService: ApplicationService,
  ) {}

  // Auth endpoints
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // User management endpoints
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  async getAllUsers(@Query('role') role?: UserRole) {
    return this.userService.findAll(role);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // Document management endpoints
  @Get('documents')
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Returns all documents' })
  async getAllDocuments() {
    return this.documentService.findAll();
  }

  @Get('documents/:id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Returns the document' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  async getDocumentById(@Param('id') id: string) {
    return this.documentService.findDocumentById(id);
  }

  @Post('documents/:id/status')
  @ApiOperation({ summary: 'Update document status' })
  @ApiResponse({ status: 200, description: 'Document status updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({ type: UpdateDocumentStatusDto })
  async updateDocumentStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDocumentStatusDto,
  ) {
    return this.documentService.updateDocumentStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.rejectionReason,
    );
  }

  // Application management endpoints
  @Get('applications')
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({ status: 200, description: 'Returns all applications' })
  async getAllApplications() {
    return this.applicationService.findAll();
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Returns the application' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  async getApplicationById(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  // Payment management endpoints
  @Get('payments')
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Returns all payments' })
  async getAllPayments() {
    return this.paymentService.findAll();
  }

  @Get('payments/:id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the payment' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  async getPaymentById(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  // Message management endpoints
  @Get('messages/student')
  @ApiOperation({ summary: 'Get all student conversations' })
  @ApiResponse({ status: 200, description: 'Returns all student conversations' })
  async getStudentConversations(@Request() req: RequestWithUser) {
    return this.messageService.findUserConversationsByType(
      req.user.userId,
      ConversationType.STUDENT_ADMIN
    );
  }

  @Get('messages/employer')
  @ApiOperation({ summary: 'Get all employer conversations' })
  @ApiResponse({ status: 200, description: 'Returns all employer conversations' })
  async getEmployerConversations(@Request() req: RequestWithUser) {
    return this.messageService.findUserConversationsByType(
      req.user.userId,
      ConversationType.EMPLOYER_ADMIN
    );
  }

  @Get('messages/conversations/:id')
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiResponse({ status: 200, description: 'Returns the conversation with messages' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async getConversation(@Param('id') id: string) {
    const conversation = await this.messageService.findConversation(id);
    const messages = await this.messageService.findConversationMessages(id, 50, 0);

    return {
      conversation,
      messages
    };
  }

  @Post('messages/reply/:conversationId')
  @ApiOperation({ summary: 'Reply to a conversation' })
  @ApiResponse({ status: 201, description: 'Reply sent successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiBody({
    description: 'Reply message',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Thank you for your message. We will assist you with your request.'
        }
      }
    }
  })
  async replyToConversation(
    @Param('conversationId') conversationId: string,
    @Body('content') content: string,
    @Request() req: RequestWithUser
  ) {
    // Verify conversation exists
    await this.messageService.findConversation(conversationId);

    // Send reply
    const message = await this.messageService.createMessage(req.user.userId, {
      conversationId,
      content
    });

    return message;
  }
}
