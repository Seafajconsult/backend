import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NotificationService } from "./notification.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Query("userId") userId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return this.notificationService.getUserNotifications(userId, page, limit);
  }

  @Get("unread/count")
  async getUnreadCount(@Query("userId") userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Post(":id/read")
  async markAsRead(@Param("id") id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Post("read-all")
  async markAllAsRead(@Query("userId") userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(":id")
  async deleteNotification(@Param("id") id: string) {
    return this.notificationService.deleteNotification(id);
  }
}
