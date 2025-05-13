import { Injectable } from "@nestjs/common";
import * as PDFDocument from "pdfkit";
import { Payment } from "../../modules/payment/payment.schema";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

// Define Cloudinary response type
interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
  url: string;
  [key: string]: any;
}

@Injectable()
export class PdfService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get("cloudinary.cloudName"),
      api_key: this.configService.get("cloudinary.apiKey"),
      api_secret: this.configService.get("cloudinary.apiSecret"),
    });
  }

  async generateInvoice(payment: Payment, user: any): Promise<{ url: string, publicId: string }> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', async () => {
          const pdfData = Buffer.concat(buffers);

          // Upload to Cloudinary
          const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "sea-faj-invoices",
                resource_type: "raw",
                format: "pdf",
                public_id: `invoice-${payment._id}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryResponse);
              },
            );

            uploadStream.end(pdfData);
          });

          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        });

        // Add content to PDF
        this.generateInvoiceContent(doc, payment, user);

        // Finalize the PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private generateInvoiceContent(doc: PDFKit.PDFDocument, payment: Payment, user: any) {
    // Add company logo
    // doc.image('path/to/logo.png', 50, 45, { width: 150 });

    // Add title
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Add invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: ${(payment as any).invoiceNumber || payment._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Due Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Add company details
    doc.fontSize(14).text('SEA-FAJ Consulting', { underline: true });
    doc.fontSize(12);
    doc.text('123 Business Street');
    doc.text('Lagos, Nigeria');
    doc.text('Email: info@sea-faj.com');
    doc.text('Phone: +234 123 456 7890');
    doc.moveDown();

    // Add client details
    doc.fontSize(14).text('Bill To:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`ID: ${user.userId}`);
    doc.moveDown();

    // Add payment details table
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

    // Add total
    doc.text('Total:', 350, bottomLineY + 20);
    doc.text(`${payment.currency} ${payment.amount.toFixed(2)}`, amountX, bottomLineY + 20);

    // Add payment instructions
    doc.moveDown(2);
    doc.fontSize(14).text('Payment Instructions', { underline: true });
    doc.fontSize(12);
    doc.text('Please make payment to:');
    doc.text('Bank: First Bank of Nigeria');
    doc.text('Account Name: SEA-FAJ Consulting Ltd');
    doc.text('Account Number: 1234567890');

    // Add footer
    const footerY = doc.page.height - 100;
    doc.fontSize(10).text('Thank you for your business!', 50, footerY, { align: 'center' });
    doc.text('This is a computer-generated invoice and does not require a signature.', 50, footerY + 15, { align: 'center' });
  }
}
