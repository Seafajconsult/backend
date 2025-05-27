import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as twilio from "twilio";

export interface SMSMessage {
  to: string;
  message: string;
  from?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class SMSService {
  private readonly logger = new Logger(SMSService.name);
  private twilioClient: twilio.Twilio;
  private readonly fromNumber: string;
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';
    this.isEnabled = !!(accountSid && authToken && this.fromNumber);

    if (this.isEnabled) {
      this.twilioClient = twilio(accountSid, authToken);
      this.logger.log('SMS service initialized with Twilio');
    } else {
      this.logger.warn('SMS service disabled - missing Twilio configuration');
    }
  }

  async sendSMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    if (!this.isEnabled) {
      this.logger.warn('SMS service is disabled');
      return { success: false, error: 'SMS service is disabled' };
    }

    try {
      // Validate phone number format
      const phoneNumber = this.formatPhoneNumber(smsMessage.to);
      if (!phoneNumber) {
        return { success: false, error: 'Invalid phone number format' };
      }

      const message = await this.twilioClient.messages.create({
        body: smsMessage.message,
        from: smsMessage.from || this.fromNumber,
        to: phoneNumber,
      });

      this.logger.log(`SMS sent successfully to ${phoneNumber}, SID: ${message.sid}`);
      return { success: true, messageId: message.sid };
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${smsMessage.to}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];
    
    for (const message of messages) {
      const result = await this.sendSMS(message);
      results.push(result);
      
      // Add small delay to avoid rate limiting
      await this.delay(100);
    }

    return results;
  }

  // Predefined SMS templates
  async sendOTPSMS(phoneNumber: string, otp: string): Promise<SMSResponse> {
    const message = `Your SEA-FAJ verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendApplicationStatusSMS(phoneNumber: string, applicationId: string, status: string): Promise<SMSResponse> {
    const message = `Your application ${applicationId} status has been updated to: ${status}. Check your dashboard for more details.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendOfferReceivedSMS(phoneNumber: string, university: string): Promise<SMSResponse> {
    const message = `Congratulations! You have received an offer from ${university}. Log in to your dashboard to view details and respond.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendInterviewScheduledSMS(phoneNumber: string, date: string, time: string): Promise<SMSResponse> {
    const message = `Your interview has been scheduled for ${date} at ${time}. Please check your email for meeting details.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendPaymentReminderSMS(phoneNumber: string, amount: string, dueDate: string): Promise<SMSResponse> {
    const message = `Payment reminder: ${amount} is due on ${dueDate}. Please complete your payment to avoid delays in processing.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendVisaAppointmentSMS(phoneNumber: string, date: string, location: string): Promise<SMSResponse> {
    const message = `Your visa appointment is scheduled for ${date} at ${location}. Please arrive 15 minutes early with all required documents.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendJobApplicationSMS(phoneNumber: string, jobTitle: string, company: string): Promise<SMSResponse> {
    const message = `You have a new job application for ${jobTitle} at ${company}. Log in to review the application.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendRecruitmentUpdateSMS(phoneNumber: string, status: string): Promise<SMSResponse> {
    const message = `Your recruitment request status has been updated to: ${status}. Check your dashboard for more information.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendReferralBonusSMS(phoneNumber: string, amount: string): Promise<SMSResponse> {
    const message = `Great news! You've earned a referral bonus of ${amount}. Check your rewards section for details.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendInvoiceGeneratedSMS(phoneNumber: string, invoiceNumber: string, amount: string): Promise<SMSResponse> {
    const message = `Invoice ${invoiceNumber} for ${amount} has been generated. Please check your email for payment details.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendWelcomeSMS(phoneNumber: string, firstName: string): Promise<SMSResponse> {
    const message = `Welcome to SEA-FAJ Consult, ${firstName}! Your account has been created successfully. Start your journey with us today.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  async sendPasswordResetSMS(phoneNumber: string, resetCode: string): Promise<SMSResponse> {
    const message = `Your password reset code is: ${resetCode}. Use this code to reset your password. Code expires in 15 minutes.`;
    return this.sendSMS({ to: phoneNumber, message });
  }

  private formatPhoneNumber(phoneNumber: string): string | null {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid length (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null;
    }

    // Add + prefix if not present
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }

    return cleaned;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check SMS service status
  getServiceStatus(): { enabled: boolean; provider: string } {
    return {
      enabled: this.isEnabled,
      provider: this.isEnabled ? 'Twilio' : 'None',
    };
  }

  // Get SMS usage statistics (if supported by provider)
  async getUsageStats(): Promise<any> {
    if (!this.isEnabled) {
      return { error: 'SMS service is disabled' };
    }

    try {
      // This would require additional Twilio API calls to get usage stats
      // For now, return basic info
      return {
        provider: 'Twilio',
        status: 'active',
        fromNumber: this.fromNumber,
      };
    } catch (error) {
      this.logger.error('Failed to get SMS usage stats:', error);
      return { error: 'Failed to retrieve usage stats' };
    }
  }
}
