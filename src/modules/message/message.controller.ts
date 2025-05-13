import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { RequestWithUser } from "../../interfaces/request.interface";

@ApiTags("Messages")
@ApiBearerAuth()
@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("conversations")
  @ApiOperation({ summary: "Get all conversations for the current user" })
  async getMyConversations(@Request() req: RequestWithUser) {
    return this.messageService.findUserConversations(req.user.userId);
  }

  @Get("conversations/:id")
  @ApiOperation({ summary: "Get a specific conversation" })
  async getConversation(@Param("id") id: string, @Request() req: RequestWithUser) {
    const conversation = await this.messageService.findConversation(id);

    // Check if user is a participant
    if (!conversation.participants.some(p => p.toString() === req.user.userId)) {
      throw new ForbiddenException("Access denied");
    }

    return conversation;
  }

  @Get("conversations/:id/messages")
  @ApiOperation({ summary: "Get messages for a conversation" })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  async getConversationMessages(
    @Param("id") id: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Request() req: RequestWithUser
  ) {
    const conversation = await this.messageService.findConversation(id);

    // Check if user is a participant
    if (!conversation.participants.some(p => p.toString() === req.user.userId)) {
      throw new ForbiddenException("Access denied");
    }

    return this.messageService.findConversationMessages(id, limit, skip);
  }

  @Post("conversations")
  @ApiOperation({ summary: "Create a new conversation" })
  async createConversation(@Body() createConversationDto: CreateConversationDto, @Request() req: RequestWithUser) {
    // Ensure current user is included in participants
    if (!createConversationDto.participants.includes(req.user.userId)) {
      createConversationDto.participants.push(req.user.userId);
    }

    return this.messageService.createConversation(createConversationDto);
  }

  @Post()
  @ApiOperation({ summary: "Send a new message" })
  async sendMessage(@Body() createMessageDto: CreateMessageDto, @Request() req: RequestWithUser) {
    return this.messageService.createMessage(req.user.userId, createMessageDto);
  }

  @Post("messages/:id/read")
  @ApiOperation({ summary: "Mark a message as read" })
  async markAsRead(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.messageService.markMessageAsRead(id, req.user.userId);
  }

  @Post("conversations/:id/deactivate")
  @ApiOperation({ summary: "Deactivate a conversation" })
  async deactivateConversation(@Param("id") id: string, @Request() req: RequestWithUser) {
    const conversation = await this.messageService.findConversation(id);

    // Check if user is a participant
    if (!conversation.participants.some(p => p.toString() === req.user.userId)) {
      throw new ForbiddenException("Access denied");
    }

    return this.messageService.deactivateConversation(id);
  }
}
