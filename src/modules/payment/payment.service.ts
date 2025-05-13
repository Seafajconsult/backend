import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Payment, PaymentType, PaymentStatus } from "./payment.schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private configService: ConfigService,
  ) {}

  async createPayment(paymentData: {
    userId: string;
    amount: number;
    paymentType: PaymentType;
    description?: string;
    metadata?: Record<string, any>;
  }) {
    const payment = await this.paymentModel.create({
      ...paymentData,
      currency: "JPY",
      status: PaymentStatus.PENDING,
    });

    // TODO: Integrate with payment gateway (e.g., Stripe, PayPal)
    // For now, we'll just simulate a successful payment
    // Use the payment ID for simulation
    await this.simulatePaymentProcessing(payment._id ? payment._id.toString() : payment.id.toString());

    return payment;
  }

  private async simulatePaymentProcessing(paymentId: string) {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.paymentModel.findByIdAndUpdate(
      paymentId,
      {
        status: PaymentStatus.COMPLETED,
        transactionId: `SIMULATED_${Date.now()}`,
        paymentMethod: "SIMULATED",
      },
      { new: true },
    );
  }

  async getUserPayments(userId: string) {
    return this.paymentModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getPaymentById(paymentId: string) {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new BadRequestException("Payment not found");
    }
    return payment;
  }

  async refundPayment(paymentId: string) {
    const payment = await this.getPaymentById(paymentId);
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException("Payment cannot be refunded");
    }

    // TODO: Integrate with payment gateway for actual refund
    return this.paymentModel.findByIdAndUpdate(
      paymentId,
      {
        status: PaymentStatus.REFUNDED,
        metadata: {
          ...payment.metadata,
          refundedAt: new Date(),
        },
      },
      { new: true },
    );
  }

  async findAll() {
    return this.paymentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(paymentId: string) {
    return this.getPaymentById(paymentId);
  }
}
