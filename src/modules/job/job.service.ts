import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Job, JobApplication, JobStatus, ApplicationStatus } from "./job.schema";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ApplyJobDto, UpdateApplicationStatusDto, ScheduleInterviewDto } from "./dto/apply-job.dto";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.schema";

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(JobApplication.name) private readonly jobApplicationModel: Model<JobApplication>,
    private readonly notificationService: NotificationService,
  ) {}

  async generateUniqueJobId(): Promise<string> {
    while (true) {
      const jobId = `JOB-${Math.floor(100000 + Math.random() * 900000)}`;
      const existingJob = await this.jobModel.findOne({ jobId });
      if (!existingJob) {
        return jobId;
      }
    }
  }

  async generateUniqueApplicationId(): Promise<string> {
    while (true) {
      const applicationId = `APP-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const existingApplication = await this.jobApplicationModel.findOne({ applicationId });
      if (!existingApplication) {
        return applicationId;
      }
    }
  }

  async createJob(employerId: string, createJobDto: CreateJobDto): Promise<Job> {
    const jobId = await this.generateUniqueJobId();

    const job = new this.jobModel({
      ...createJobDto,
      jobId,
      employerId,
      applicationDeadline: new Date(createJobDto.applicationDeadline),
    });

    const savedJob = await job.save();

    // Send notification to employer
    await this.notificationService.createNotification({
      userId: employerId,
      title: "Job Posted Successfully",
      message: `Your job posting "${createJobDto.title}" has been created successfully.`,
      type: NotificationType.SYSTEM_UPDATE,
      data: { jobId: savedJob.jobId },
    });

    return savedJob;
  }

  async findAllJobs(
    page: number = 1,
    limit: number = 10,
    filters?: {
      location?: string;
      jobType?: string;
      experienceLevel?: string;
      skills?: string[];
      salaryMin?: number;
      salaryMax?: number;
      isRemote?: boolean;
    }
  ): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = { status: JobStatus.ACTIVE };

    // Apply filters
    if (filters) {
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      if (filters.jobType) {
        query.jobType = filters.jobType;
      }
      if (filters.experienceLevel) {
        query.experienceLevel = filters.experienceLevel;
      }
      if (filters.skills && filters.skills.length > 0) {
        query.skills = { $in: filters.skills };
      }
      if (filters.salaryMin) {
        query['salary.min'] = { $gte: filters.salaryMin };
      }
      if (filters.salaryMax) {
        query['salary.max'] = { $lte: filters.salaryMax };
      }
      if (filters.isRemote !== undefined) {
        query.isRemote = filters.isRemote;
      }
    }

    const [jobs, total] = await Promise.all([
      this.jobModel.find(query)
        .populate('employerId', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.jobModel.countDocuments(query).exec(),
    ]);

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findJobById(jobId: string): Promise<Job> {
    const job = await this.jobModel.findOne({ jobId })
      .populate('employerId', 'email')
      .exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    // Increment views count
    await this.jobModel.findByIdAndUpdate(job._id, { $inc: { viewsCount: 1 } });

    return job;
  }

  async findJobsByEmployer(employerId: string): Promise<Job[]> {
    return this.jobModel.find({ employerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateJob(jobId: string, employerId: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobModel.findOne({ jobId });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.employerId.toString() !== employerId) {
      throw new ForbiddenException('You can only update your own job postings');
    }

    const updatedJob = await this.jobModel.findByIdAndUpdate(
      job._id,
      { ...updateJobDto },
      { new: true }
    ).exec();

    return updatedJob;
  }

  async deleteJob(jobId: string, employerId: string): Promise<void> {
    const job = await this.jobModel.findOne({ jobId });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.employerId.toString() !== employerId) {
      throw new ForbiddenException('You can only delete your own job postings');
    }

    await this.jobModel.findByIdAndDelete(job._id);
  }

  async applyForJob(jobId: string, applicantId: string, applyJobDto: ApplyJobDto): Promise<JobApplication> {
    const job = await this.findJobById(jobId);

    if (job.status !== JobStatus.ACTIVE) {
      throw new BadRequestException('This job is no longer accepting applications');
    }

    if (new Date() > job.applicationDeadline) {
      throw new BadRequestException('Application deadline has passed');
    }

    // Check if user already applied
    const existingApplication = await this.jobApplicationModel.findOne({
      jobId: job._id,
      applicantId,
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const applicationId = await this.generateUniqueApplicationId();

    const application = new this.jobApplicationModel({
      applicationId,
      jobId: job._id,
      applicantId,
      employerId: job.employerId,
      ...applyJobDto,
      statusHistory: [{
        date: new Date(),
        status: ApplicationStatus.APPLIED,
        note: 'Application submitted',
        updatedBy: applicantId,
      }],
    });

    const savedApplication = await application.save();

    // Update job applications count
    await this.jobModel.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

    // Send notifications
    await Promise.all([
      this.notificationService.createNotification({
        userId: applicantId,
        title: "Application Submitted",
        message: `Your application for "${job.title}" has been submitted successfully.`,
        type: NotificationType.APPLICATION_SUBMITTED,
        data: { jobId: job.jobId, applicationId: savedApplication.applicationId },
      }),
      this.notificationService.createNotification({
        userId: job.employerId.toString(),
        title: "New Job Application",
        message: `You have received a new application for "${job.title}".`,
        type: NotificationType.APPLICATION_SUBMITTED,
        data: { jobId: job.jobId, applicationId: savedApplication.applicationId },
      }),
    ]);

    return savedApplication;
  }

  async getJobApplications(
    jobId: string,
    employerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ applications: JobApplication[]; total: number; page: number; totalPages: number }> {
    const job = await this.jobModel.findOne({ jobId });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.employerId.toString() !== employerId) {
      throw new ForbiddenException('You can only view applications for your own job postings');
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.jobApplicationModel.find({ jobId: job._id })
        .populate('applicantId', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.jobApplicationModel.countDocuments({ jobId: job._id }).exec(),
    ]);

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getApplicationById(applicationId: string, userId: string): Promise<JobApplication> {
    const application = await this.jobApplicationModel.findOne({ applicationId })
      .populate('jobId')
      .populate('applicantId', 'email')
      .populate('employerId', 'email')
      .exec();

    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found`);
    }

    // Check if user has permission to view this application
    if (application.applicantId.toString() !== userId && application.employerId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to view this application');
    }

    return application;
  }

  async updateApplicationStatus(
    applicationId: string,
    employerId: string,
    updateStatusDto: UpdateApplicationStatusDto
  ): Promise<JobApplication> {
    const application = await this.jobApplicationModel.findOne({ applicationId });

    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found`);
    }

    if (application.employerId.toString() !== employerId) {
      throw new ForbiddenException('You can only update applications for your own job postings');
    }

    // Add to status history
    application.statusHistory.push({
      date: new Date(),
      status: updateStatusDto.status,
      note: updateStatusDto.note || '',
      updatedBy: employerId,
    });

    application.status = updateStatusDto.status as ApplicationStatus;
    const updatedApplication = await application.save();

    // Send notification to applicant
    await this.notificationService.createNotification({
      userId: application.applicantId.toString(),
      title: "Application Status Updated",
      message: `Your application status has been updated to: ${updateStatusDto.status}`,
      type: NotificationType.APPLICATION_STATUS_CHANGE,
      data: { applicationId: application.applicationId, newStatus: updateStatusDto.status },
    });

    return updatedApplication;
  }

  async scheduleInterview(
    applicationId: string,
    employerId: string,
    scheduleInterviewDto: ScheduleInterviewDto
  ): Promise<JobApplication> {
    const application = await this.jobApplicationModel.findOne({ applicationId });

    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found`);
    }

    if (application.employerId.toString() !== employerId) {
      throw new ForbiddenException('You can only schedule interviews for your own job postings');
    }

    application.interviewDetails = {
      scheduledDate: new Date(scheduleInterviewDto.scheduledDate),
      interviewType: scheduleInterviewDto.interviewType,
      meetingLink: scheduleInterviewDto.meetingLink,
      location: scheduleInterviewDto.location,
      interviewerNotes: scheduleInterviewDto.notes,
    };

    application.status = ApplicationStatus.INTERVIEW_SCHEDULED;

    // Add to status history
    application.statusHistory.push({
      date: new Date(),
      status: ApplicationStatus.INTERVIEW_SCHEDULED,
      note: `Interview scheduled for ${scheduleInterviewDto.scheduledDate}`,
      updatedBy: employerId,
    });

    const updatedApplication = await application.save();

    // Send notification to applicant
    await this.notificationService.createNotification({
      userId: application.applicantId.toString(),
      title: "Interview Scheduled",
      message: `Your interview has been scheduled for ${scheduleInterviewDto.scheduledDate}`,
      type: NotificationType.MEETING_SCHEDULED,
      data: {
        applicationId: application.applicationId,
        interviewDate: scheduleInterviewDto.scheduledDate,
        interviewType: scheduleInterviewDto.interviewType,
      },
    });

    return updatedApplication;
  }

  async getApplicantApplications(applicantId: string): Promise<JobApplication[]> {
    return this.jobApplicationModel.find({ applicantId })
      .populate('jobId')
      .populate('employerId', 'email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getJobStats(employerId: string): Promise<any> {
    const jobs = await this.jobModel.find({ employerId });
    const jobIds = jobs.map(job => job._id);

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
    ] = await Promise.all([
      this.jobModel.countDocuments({ employerId }),
      this.jobModel.countDocuments({ employerId, status: JobStatus.ACTIVE }),
      this.jobApplicationModel.countDocuments({ jobId: { $in: jobIds } }),
      this.jobApplicationModel.countDocuments({
        jobId: { $in: jobIds },
        status: ApplicationStatus.APPLIED
      }),
      this.jobApplicationModel.countDocuments({
        jobId: { $in: jobIds },
        status: ApplicationStatus.SHORTLISTED
      }),
    ]);

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
    };
  }
}
