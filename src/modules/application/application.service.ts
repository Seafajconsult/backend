import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationStatus } from './application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UserService } from '../user/user.service';
import { DocumentService } from '../document/document.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.schema';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<Application>,
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private readonly notificationService: NotificationService,
  ) {}

  async generateUniqueApplicationId(): Promise<string> {
    while (true) {
      const applicationId = `APP-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const existingApplication = await this.applicationModel.findOne({ applicationId });
      if (!existingApplication) {
        return applicationId;
      }
    }
  }

  async create(studentId: string, createApplicationDto: CreateApplicationDto): Promise<Application> {
    const applicationId = await this.generateUniqueApplicationId();

    const application = new this.applicationModel({
      ...createApplicationDto,
      applicationId,
      studentId,
      statusHistory: [{
        date: new Date(),
        status: ApplicationStatus.DRAFT,
        note: 'Application created'
      }]
    });

    const savedApplication = await application.save();

    // Send notification
    await this.notificationService.createNotification({
      userId: studentId,
      title: "Application Created",
      message: `Your application for ${createApplicationDto.course} at ${createApplicationDto.university} has been created.`,
      type: NotificationType.APPLICATION_SUBMITTED,
      data: { applicationId: savedApplication.applicationId },
    });

    return savedApplication;
  }

  async findOne(applicationId: string): Promise<Application> {
    const application = await this.applicationModel.findOne({ applicationId })
      .populate('studentId', 'email firstName lastName')
      .populate('assignedAdvisor', 'email firstName lastName')
      .exec();

    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found`);
    }

    return application;
  }

  async findByStudent(studentId: string): Promise<Application[]> {
    return this.applicationModel.find({ studentId })
      .populate('assignedAdvisor', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByEmployer(employerId: string): Promise<Application[]> {
    return this.applicationModel.find({ employerId })
      .populate('studentId', 'email firstName lastName')
      .populate('assignedAdvisor', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    note?: string,
    updatedBy?: string
  ): Promise<Application> {
    const application = await this.findOne(applicationId);

    application.status = newStatus;
    application.statusHistory.push({
      date: new Date(),
      status: newStatus,
      note: note || `Status updated to ${newStatus}`,
    });

    const updatedApplication = await application.save();

    // Send notification to student
    await this.notificationService.createNotification({
      userId: application.studentId.toString(),
      title: "Application Status Updated",
      message: `Your application status has been updated to: ${newStatus}`,
      type: NotificationType.APPLICATION_STATUS_CHANGE,
      data: { applicationId: application.applicationId, newStatus },
    });

    return updatedApplication;
  }

  async acceptOffer(applicationId: string, studentId: string): Promise<Application> {
    const application = await this.findOne(applicationId);

    // Verify the student owns this application
    if (application.studentId.toString() !== studentId) {
      throw new ForbiddenException('You can only accept offers for your own applications');
    }

    // Check if application has an offer
    if (application.status !== ApplicationStatus.OFFER_RECEIVED) {
      throw new BadRequestException('No offer available to accept');
    }

    // Check if offer is still valid
    if (application.offerDetails?.acceptanceDeadline && new Date() > application.offerDetails.acceptanceDeadline) {
      throw new BadRequestException('Offer has expired');
    }

    // Update status to accepted
    application.status = ApplicationStatus.OFFER_ACCEPTED;
    application.statusHistory.push({
      date: new Date(),
      status: ApplicationStatus.OFFER_ACCEPTED,
      note: 'Offer accepted by student',
    });

    const updatedApplication = await application.save();

    // Send notifications
    await Promise.all([
      this.notificationService.createNotification({
        userId: studentId,
        title: "Offer Accepted",
        message: `You have successfully accepted the offer for ${application.course} at ${application.university}.`,
        type: NotificationType.OFFER_RECEIVED,
        data: { applicationId: application.applicationId },
      }),
      // Notify assigned advisor if exists
      application.assignedAdvisor ? this.notificationService.createNotification({
        userId: application.assignedAdvisor.toString(),
        title: "Student Accepted Offer",
        message: `Student has accepted the offer for ${application.course} at ${application.university}.`,
        type: NotificationType.APPLICATION_STATUS_CHANGE,
        data: { applicationId: application.applicationId, studentId },
      }) : Promise.resolve(),
    ]);

    return updatedApplication;
  }

  async rejectOffer(applicationId: string, studentId: string, reason?: string): Promise<Application> {
    const application = await this.findOne(applicationId);

    // Verify the student owns this application
    if (application.studentId.toString() !== studentId) {
      throw new ForbiddenException('You can only reject offers for your own applications');
    }

    // Check if application has an offer
    if (application.status !== ApplicationStatus.OFFER_RECEIVED) {
      throw new BadRequestException('No offer available to reject');
    }

    // Update status to rejected
    application.status = ApplicationStatus.OFFER_REJECTED;
    application.statusHistory.push({
      date: new Date(),
      status: ApplicationStatus.OFFER_REJECTED,
      note: reason ? `Offer rejected by student: ${reason}` : 'Offer rejected by student',
    });

    const updatedApplication = await application.save();

    // Send notifications
    await Promise.all([
      this.notificationService.createNotification({
        userId: studentId,
        title: "Offer Rejected",
        message: `You have rejected the offer for ${application.course} at ${application.university}.`,
        type: NotificationType.APPLICATION_STATUS_CHANGE,
        data: { applicationId: application.applicationId },
      }),
      // Notify assigned advisor if exists
      application.assignedAdvisor ? this.notificationService.createNotification({
        userId: application.assignedAdvisor.toString(),
        title: "Student Rejected Offer",
        message: `Student has rejected the offer for ${application.course} at ${application.university}.`,
        type: NotificationType.APPLICATION_STATUS_CHANGE,
        data: { applicationId: application.applicationId, studentId, reason },
      }) : Promise.resolve(),
    ]);

    return updatedApplication;
  }

  async getAllApplications(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: string;
      studentId?: string;
      country?: string;
      university?: string;
    }
  ): Promise<{ applications: Application[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.studentId) query.studentId = filters.studentId;
      if (filters.country) query.country = filters.country;
      if (filters.university) query.university = { $regex: filters.university, $options: 'i' };
    }

    const [applications, total] = await Promise.all([
      this.applicationModel.find(query)
        .populate('studentId', 'email firstName lastName')
        .populate('assignedAdvisor', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.applicationModel.countDocuments(query).exec(),
    ]);

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getApplicationStats(studentId?: string): Promise<any> {
    const query = studentId ? { studentId } : {};

    const [
      totalApplications,
      draftApplications,
      submittedApplications,
      offerReceivedApplications,
      acceptedApplications,
      rejectedApplications,
      completedApplications,
    ] = await Promise.all([
      this.applicationModel.countDocuments(query),
      this.applicationModel.countDocuments({ ...query, status: ApplicationStatus.DRAFT }),
      this.applicationModel.countDocuments({ ...query, status: ApplicationStatus.SUBMITTED }),
      this.applicationModel.countDocuments({ ...query, status: ApplicationStatus.OFFER_RECEIVED }),
      this.applicationModel.countDocuments({ ...query, status: ApplicationStatus.OFFER_ACCEPTED }),
      this.applicationModel.countDocuments({ ...query, status: ApplicationStatus.OFFER_REJECTED }),
      this.applicationModel.countDocuments({ ...query, status: ApplicationStatus.COMPLETED }),
    ]);

    return {
      totalApplications,
      draftApplications,
      submittedApplications,
      offerReceivedApplications,
      acceptedApplications,
      rejectedApplications,
      completedApplications,
    };
  }
}