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
import { NotificationService } from "../notification/notification.service";
import { LoginDto } from "../auth/dto/login.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
import { ConversationType } from "../message/conversation.schema";

@ApiTags('Super Admin')
@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class SuperAdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
  ) {}

  // Auth endpoints
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Super Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Admin management endpoints
  @Post('admins/invite')
  @ApiOperation({ summary: 'Invite a new admin' })
  @ApiResponse({ status: 201, description: 'Admin invitation sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  async inviteAdmin(@Body('email') email: string) {
    return this.authService.inviteAdmin(email);
  }

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Returns all admins' })
  async getAllAdmins() {
    return this.userService.findAll(UserRole.ADMIN);
  }

  @Get('admins/:id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Returns the admin' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  async getAdminById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Delete('admins/:id')
  @ApiOperation({ summary: 'Delete an admin' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  async deleteAdmin(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // System management endpoints
  @Get('system/stats')
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'Returns system statistics' })
  async getSystemStats() {
    // Implementation will depend on what statistics are needed
    return {
      totalUsers: await this.userService.count(),
      usersByRole: {
        students: await this.userService.countByRole(UserRole.STUDENT),
        employers: await this.userService.countByRole(UserRole.EMPLOYER),
        admins: await this.userService.countByRole(UserRole.ADMIN),
      }
    };
  }

  // Chat logs endpoints
  @Get('messages/all')
  @ApiOperation({ summary: 'Get all conversations in the system' })
  @ApiResponse({ status: 200, description: 'Returns all conversations' })
  async getAllConversations() {
    return this.messageService.findAllConversations();
  }

  @Get('messages/student-admin')
  @ApiOperation({ summary: 'Get all student-admin conversations' })
  @ApiResponse({ status: 200, description: 'Returns all student-admin conversations' })
  async getStudentAdminConversations() {
    return this.messageService.findConversationsByType(ConversationType.STUDENT_ADMIN);
  }

  @Get('messages/employer-admin')
  @ApiOperation({ summary: 'Get all employer-admin conversations' })
  @ApiResponse({ status: 200, description: 'Returns all employer-admin conversations' })
  async getEmployerAdminConversations() {
    return this.messageService.findConversationsByType(ConversationType.EMPLOYER_ADMIN);
  }

  @Get('messages/conversations/:id')
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiResponse({ status: 200, description: 'Returns the conversation with messages' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async getConversation(@Param('id') id: string) {
    const conversation = await this.messageService.findConversation(id);
    const messages = await this.messageService.findConversationMessages(id, 100, 0);

    return {
      conversation,
      messages
    };
  }

  // Notification endpoints
  @Get('notifications')
  @ApiOperation({ summary: 'Get all notifications for super admin' })
  @ApiResponse({ status: 200, description: 'Returns all notifications' })
  async getNotifications(@Request() req: RequestWithUser) {
    return this.notificationService.getUserNotifications(req.user.userId);
  }

  @Get('notifications/unread/count')
  @ApiOperation({ summary: 'Get count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Returns count of unread notifications' })
  async getUnreadCount(@Request() req: RequestWithUser) {
    return {
      count: await this.notificationService.getUnreadCount(req.user.userId)
    };
  }

  @Post('notifications/:id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  async markNotificationAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Post('notifications/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllNotificationsAsRead(@Request() req: RequestWithUser) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }
}
