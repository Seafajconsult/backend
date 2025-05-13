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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let PdfService = class PdfService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get("cloudinary.cloudName"),
            api_key: this.configService.get("cloudinary.apiKey"),
            api_secret: this.configService.get("cloudinary.apiSecret"),
        });
    }
    async generateInvoice(payment, user) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const buffers = [];
                doc.on('data', (chunk) => buffers.push(chunk));
                doc.on('end', async () => {
                    const pdfData = Buffer.concat(buffers);
                    const result = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                            folder: "sea-faj-invoices",
                            resource_type: "raw",
                            format: "pdf",
                            public_id: `invoice-${payment._id}`,
                        }, (error, result) => {
                            if (error)
                                reject(error);
                            else
                                resolve(result);
                        });
                        uploadStream.end(pdfData);
                    });
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                });
                this.generateInvoiceContent(doc, payment, user);
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    generateInvoiceContent(doc, payment, user) {
        doc.fontSize(20).text('INVOICE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Invoice Number: ${payment.invoiceNumber || payment._id}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Due Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.fontSize(14).text('SEA-FAJ Consulting', { underline: true });
        doc.fontSize(12);
        doc.text('123 Business Street');
        doc.text('Lagos, Nigeria');
        doc.text('Email: info@sea-faj.com');
        doc.text('Phone: +234 123 456 7890');
        doc.moveDown();
        doc.fontSize(14).text('Bill To:', { underline: true });
        doc.fontSize(12);
        doc.text(`Name: ${user.firstName} ${user.lastName}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`ID: ${user.userId}`);
        doc.moveDown();
        doc.fontSize(14).text('Payment Details', { underline: true });
        doc.moveDown();
        const tableTop = doc.y;
        const itemX = 50;
        const descriptionX = 150;
        const amountX = 400;
        doc.fontSize(12);
        doc.text('Item', itemX, tableTop);
        doc.text('Description', descriptionX, tableTop);
        doc.text('Amount', amountX, tableTop);
        const lineY = doc.y + 5;
        doc.moveTo(50, lineY).lineTo(550, lineY).stroke();
        const rowY = doc.y + 10;
        doc.text(payment.paymentType, itemX, rowY);
        doc.text(payment.description || 'Service fee', descriptionX, rowY);
        doc.text(`${payment.currency} ${payment.amount.toFixed(2)}`, amountX, rowY);
        const bottomLineY = doc.y + 20;
        doc.moveTo(50, bottomLineY).lineTo(550, bottomLineY).stroke();
        doc.text('Total:', 350, bottomLineY + 20);
        doc.text(`${payment.currency} ${payment.amount.toFixed(2)}`, amountX, bottomLineY + 20);
        doc.moveDown(2);
        doc.fontSize(14).text('Payment Instructions', { underline: true });
        doc.fontSize(12);
        doc.text('Please make payment to:');
        doc.text('Bank: First Bank of Nigeria');
        doc.text('Account Name: SEA-FAJ Consulting Ltd');
        doc.text('Account Number: 1234567890');
        const footerY = doc.page.height - 100;
        doc.fontSize(10).text('Thank you for your business!', 50, footerY, { align: 'center' });
        doc.text('This is a computer-generated invoice and does not require a signature.', 50, footerY + 15, { align: 'center' });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PdfService);
//# sourceMappingURL=pdf.service.js.map