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
import { MessageService } from "../message/message.service";
import { ApplicationService } from "../application/application.service";
import { RegisterDto } from "../auth/dto/register.dto";
import { VerifyOtpDto } from "../auth/dto/verify-otp.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
import { ConversationType } from "../message/conversation.schema";
import { NotFoundException } from "@nestjs/common";

@ApiTags('Employer')
@Controller('employer')
export class EmployerController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly applicationService: ApplicationService,
  ) {}

  // Auth endpoints
  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new employer account' })
  @ApiResponse({ status: 201, description: 'Employer account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    // Override the role to ensure it's always EMPLOYER
    const employerDto = { ...registerDto, role: UserRole.EMPLOYER };
    return this.authService.register(employerDto);
  }

  @Post('auth/verify-otp')
  @ApiOperation({ summary: 'Verify employer email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyEmail(verifyOtpDto.userId, verifyOtpDto.otp);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Employer login' })
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

  // Job posting endpoints will be added here

  // Application endpoints
  @Get('applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications for the employer' })
  @ApiResponse({ status: 200, description: 'Returns all applications' })
  async getEmployerApplications(@Request() req: RequestWithUser) {
    return this.applicationService.findByEmployer(req.user.userId);
  }

  @Get('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific application by ID' })
  @ApiResponse({ status: 200, description: 'Returns the application' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  async getApplicationById(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.applicationService.findOne(id);
  }

  // Status endpoint
  @Get('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employer account status' })
  @ApiResponse({ status: 200, description: 'Returns employer status information' })
  async getStatus(@Request() req: RequestWithUser) {
    // Implementation will depend on what status information is needed
    return {
      status: 'active',
      userId: req.user.userId,
      role: req.user.role
    };
  }

  // Admin messaging endpoints
  @Post('messages/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
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
          example: 'Hello, I need help with posting a job.'
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
      ConversationType.EMPLOYER_ADMIN
    );

    let conversation;
    if (existingConversations.length > 0) {
      // Use existing conversation
      conversation = existingConversations[0];
    } else {
      // Create new conversation
      conversation = await this.messageService.createConversation({
        participants: [req.user.userId, adminUser.userId],
        type: ConversationType.EMPLOYER_ADMIN
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
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin conversation messages' })
  @ApiResponse({ status: 200, description: 'Returns admin conversation messages' })
  async getAdminMessages(@Request() req: RequestWithUser) {
    // Find conversations with admins
    const adminConversations = await this.messageService.findUserConversationsByType(
      req.user.userId,
      ConversationType.EMPLOYER_ADMIN
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
