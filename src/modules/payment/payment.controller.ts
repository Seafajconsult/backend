import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/user.schema";
import { PaymentService } from "./payment.service";
import { PaymentType } from "./payment.schema";

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body()
    paymentData: {
      userId: string;
      amount: number;
      paymentType: PaymentType;
      description?: string;
      metadata?: Record<string, any>;
    },
  ) {
    return this.paymentService.createPayment(paymentData);
  }

  @Get("user/:userId")
  async getUserPayments(@Param("userId") userId: string) {
    return this.paymentService.getUserPayments(userId);
  }

  @Post(":id/refund")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async refundPayment(@Param("id") paymentId: string) {
    return this.paymentService.refundPayment(paymentId);
  }
}
