import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Invoice, InvoiceTemplate, InvoiceStatus } from "./invoice.schema";
import { CreateInvoiceDto, UpdateInvoiceStatusDto, RecordPaymentDto } from "./dto/create-invoice.dto";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.schema";
import { PdfService } from "../../shared/services/pdf.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(InvoiceTemplate.name) private readonly invoiceTemplateModel: Model<InvoiceTemplate>,
    private readonly notificationService: NotificationService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
  ) {}

  async generateInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice for this month
    const lastInvoice = await this.invoiceModel
      .findOne({
        invoiceNumber: { $regex: `^INV-${currentYear}${currentMonth}` }
      })
      .sort({ invoiceNumber: -1 })
      .exec();

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `INV-${currentYear}${currentMonth}-${String(sequence).padStart(4, '0')}`;
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoiceNumber = await this.generateInvoiceNumber();

    // Get default company information
    const billFrom = {
      name: "SEA-FAJ Consult",
      email: "billing@sea-faj.com",
      address: "123 Business Street, City, Country",
      phone: "+1234567890",
      company: "SEA-FAJ Consult Ltd",
      taxId: "TAX123456789",
      logo: "https://sea-faj.com/logo.png",
    };

    const invoice = new this.invoiceModel({
      ...createInvoiceDto,
      invoiceNumber,
      issueDate: new Date(),
      dueDate: new Date(createInvoiceDto.dueDate),
      billFrom,
      paymentHistory: [],
    });

    const savedInvoice = await invoice.save();

    // Generate PDF
    await this.generateInvoicePdf(savedInvoice._id.toString());

    // Send notification
    await this.notificationService.createNotification({
      userId: createInvoiceDto.userId,
      title: "Invoice Generated",
      message: `Invoice ${invoiceNumber} has been generated for ${createInvoiceDto.totalAmount} ${createInvoiceDto.currency}`,
      type: NotificationType.INVOICE_GENERATED,
      data: { invoiceId: savedInvoice._id, invoiceNumber },
    });

    return savedInvoice;
  }

  async findAllInvoices(
    page: number = 1,
    limit: number = 10,
    filters?: {
      userId?: string;
      status?: string;
      invoiceType?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ invoices: Invoice[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters) {
      if (filters.userId) query.userId = filters.userId;
      if (filters.status) query.status = filters.status;
      if (filters.invoiceType) query.invoiceType = filters.invoiceType;
      if (filters.startDate || filters.endDate) {
        query.issueDate = {};
        if (filters.startDate) query.issueDate.$gte = new Date(filters.startDate);
        if (filters.endDate) query.issueDate.$lte = new Date(filters.endDate);
      }
    }

    const [invoices, total] = await Promise.all([
      this.invoiceModel.find(query)
        .populate('userId', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.invoiceModel.countDocuments(query).exec(),
    ]);

    return {
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findInvoiceById(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(invoiceId)
      .populate('userId', 'email firstName lastName')
      .populate('paymentId')
      .exec();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    return invoice;
  }

  async findInvoiceByNumber(invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ invoiceNumber })
      .populate('userId', 'email firstName lastName')
      .populate('paymentId')
      .exec();

    if (!invoice) {
      throw new NotFoundException(`Invoice with number ${invoiceNumber} not found`);
    }

    return invoice;
  }

  async findUserInvoices(userId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateInvoiceStatus(
    invoiceId: string,
    updateStatusDto: UpdateInvoiceStatusDto
  ): Promise<Invoice> {
    const invoice = await this.findInvoiceById(invoiceId);

    invoice.status = updateStatusDto.status as InvoiceStatus;
    
    if (updateStatusDto.paidDate) {
      invoice.paidDate = new Date(updateStatusDto.paidDate);
    }

    const updatedInvoice = await invoice.save();

    // Send notification
    await this.notificationService.createNotification({
      userId: invoice.userId.toString(),
      title: "Invoice Status Updated",
      message: `Invoice ${invoice.invoiceNumber} status has been updated to: ${updateStatusDto.status}`,
      type: NotificationType.PAYMENT_SUCCESSFUL,
      data: { invoiceId: invoice._id, invoiceNumber: invoice.invoiceNumber, newStatus: updateStatusDto.status },
    });

    return updatedInvoice;
  }

  async recordPayment(
    invoiceId: string,
    recordPaymentDto: RecordPaymentDto
  ): Promise<Invoice> {
    const invoice = await this.findInvoiceById(invoiceId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    // Add payment to history
    invoice.paymentHistory.push({
      date: recordPaymentDto.paymentDate ? new Date(recordPaymentDto.paymentDate) : new Date(),
      amount: recordPaymentDto.amount,
      method: recordPaymentDto.method,
      transactionId: recordPaymentDto.transactionId,
    });

    // Check if fully paid
    const totalPaid = invoice.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (totalPaid >= invoice.totalAmount) {
      invoice.status = InvoiceStatus.PAID;
      invoice.paidDate = new Date();
    }

    const updatedInvoice = await invoice.save();

    // Send notification
    await this.notificationService.createNotification({
      userId: invoice.userId.toString(),
      title: "Payment Recorded",
      message: `Payment of ${recordPaymentDto.amount} ${invoice.currency} has been recorded for invoice ${invoice.invoiceNumber}`,
      type: NotificationType.PAYMENT_SUCCESSFUL,
      data: { 
        invoiceId: invoice._id, 
        invoiceNumber: invoice.invoiceNumber, 
        paymentAmount: recordPaymentDto.amount,
        transactionId: recordPaymentDto.transactionId,
      },
    });

    return updatedInvoice;
  }

  async generateInvoicePdf(invoiceId: string): Promise<string> {
    const invoice = await this.findInvoiceById(invoiceId);
    
    // Generate PDF using PDF service
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice);
    
    // Upload to cloud storage and get URL
    const pdfUrl = await this.pdfService.uploadPdf(pdfBuffer, `invoice-${invoice.invoiceNumber}.pdf`);
    
    // Update invoice with PDF URL
    invoice.pdfUrl = pdfUrl;
    await invoice.save();

    return pdfUrl;
  }

  async sendInvoiceEmail(invoiceId: string): Promise<void> {
    const invoice = await this.findInvoiceById(invoiceId);

    if (!invoice.pdfUrl) {
      await this.generateInvoicePdf(invoiceId);
    }

    // Send email with invoice PDF
    await this.emailService.sendInvoiceEmail(
      invoice.billTo.email,
      invoice.billTo.name,
      invoice.invoiceNumber,
      invoice.totalAmount,
      invoice.currency,
      invoice.pdfUrl
    );

    // Update invoice status to sent
    if (invoice.status === InvoiceStatus.DRAFT) {
      invoice.status = InvoiceStatus.SENT;
      await invoice.save();
    }
  }

  async getInvoiceStats(userId?: string): Promise<any> {
    const query = userId ? { userId } : {};

    const [
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      totalAmount,
      paidAmount,
    ] = await Promise.all([
      this.invoiceModel.countDocuments(query),
      this.invoiceModel.countDocuments({ ...query, status: InvoiceStatus.DRAFT }),
      this.invoiceModel.countDocuments({ ...query, status: InvoiceStatus.SENT }),
      this.invoiceModel.countDocuments({ ...query, status: InvoiceStatus.PAID }),
      this.invoiceModel.countDocuments({ ...query, status: InvoiceStatus.OVERDUE }),
      this.invoiceModel.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]).then(result => result[0]?.total || 0),
      this.invoiceModel.aggregate([
        { $match: { ...query, status: InvoiceStatus.PAID } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]).then(result => result[0]?.total || 0),
    ]);

    return {
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      totalAmount,
      paidAmount,
      outstandingAmount: totalAmount - paidAmount,
    };
  }

  async markOverdueInvoices(): Promise<void> {
    const overdueDate = new Date();
    
    await this.invoiceModel.updateMany(
      {
        status: InvoiceStatus.SENT,
        dueDate: { $lt: overdueDate }
      },
      {
        status: InvoiceStatus.OVERDUE
      }
    );
  }
}
