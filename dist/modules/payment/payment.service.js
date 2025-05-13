"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./payment.schema");
const config_1 = require("@nestjs/config");
let PaymentService = class PaymentService {
    constructor(paymentModel, configService) {
        this.paymentModel = paymentModel;
        this.configService = configService;
    }
    async createPayment(paymentData) {
        const payment = await this.paymentModel.create({
            ...paymentData,
            currency: "JPY",
            status: payment_schema_1.PaymentStatus.PENDING,
        });
        await this.simulatePaymentProcessing(payment._id ? payment._id.toString() : payment.id.toString());
        return payment;
    }
    async simulatePaymentProcessing(paymentId) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.paymentModel.findByIdAndUpdate(paymentId, {
            status: payment_schema_1.PaymentStatus.COMPLETED,
            transactionId: `SIMULATED_${Date.now()}`,
            paymentMethod: "SIMULATED",
        }, { new: true });
    }
    async getUserPayments(userId) {
        return this.paymentModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
    async getPaymentById(paymentId) {
        const payment = await this.paymentModel.findById(paymentId);
        if (!payment) {
            throw new common_1.BadRequestException("Payment not found");
        }
        return payment;
    }
    async refundPayment(paymentId) {
        const payment = await this.getPaymentById(paymentId);
        if (payment.status !== payment_schema_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException("Payment cannot be refunded");
        }
        return this.paymentModel.findByIdAndUpdate(paymentId, {
            status: payment_schema_1.PaymentStatus.REFUNDED,
            metadata: {
                ...payment.metadata,
                refundedAt: new Date(),
            },
        }, { new: true });
    }
    async findAll() {
        return this.paymentModel.find().sort({ createdAt: -1 }).exec();
    }
    async findById(paymentId) {
        return this.getPaymentById(paymentId);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map