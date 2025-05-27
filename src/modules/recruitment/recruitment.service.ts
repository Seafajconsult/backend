import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RecruitmentRequest, RecruitmentCandidate, RecruitmentStatus } from "./recruitment.schema";
import { CreateRecruitmentRequestDto, UpdateRecruitmentStatusDto, AssignRecruiterDto } from "./dto/create-recruitment-request.dto";
import { AddCandidateDto, UpdateCandidateStatusDto, ScheduleCandidateInterviewDto, CandidateInterviewFeedbackDto } from "./dto/candidate.dto";
import { UserService } from "../user/user.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.schema";

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectModel(RecruitmentRequest.name) private readonly recruitmentRequestModel: Model<RecruitmentRequest>,
    @InjectModel(RecruitmentCandidate.name) private readonly recruitmentCandidateModel: Model<RecruitmentCandidate>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async generateUniqueRequestId(): Promise<string> {
    while (true) {
      const requestId = `REC-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const existingRequest = await this.recruitmentRequestModel.findOne({ requestId });
      if (!existingRequest) {
        return requestId;
      }
    }
  }

  async createRecruitmentRequest(
    employerId: string,
    createRequestDto: CreateRecruitmentRequestDto
  ): Promise<RecruitmentRequest> {
    // Get employer details
    const employer = await this.userService.findById(employerId);
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    const requestId = await this.generateUniqueRequestId();

    const recruitmentRequest = new this.recruitmentRequestModel({
      ...createRequestDto,
      requestId,
      employerId,
      companyName: employer.employerProfile?.companyName || 'Unknown Company',
      employerIdNumber: employer.userId,
      contactName: employer.firstName + ' ' + employer.lastName,
      contactEmail: employer.email,
      industry: employer.employerProfile?.industry || 'Unknown',
      preferredStartDate: new Date(createRequestDto.preferredStartDate),
      statusHistory: [{
        date: new Date(),
        status: RecruitmentStatus.PENDING,
        note: 'Recruitment request submitted',
        updatedBy: employerId,
      }],
    });

    const savedRequest = await recruitmentRequest.save();

    // Send notifications
    await Promise.all([
      this.notificationService.createNotification({
        userId: employerId,
        title: "Recruitment Request Submitted",
        message: `Your recruitment request "${createRequestDto.jobTitle}" has been submitted successfully.`,
        type: NotificationType.SYSTEM_UPDATE,
        data: { requestId: savedRequest.requestId },
      }),
      // Notify admins about new recruitment request
      this.notifyAdmins(
        "New Recruitment Request",
        `A new recruitment request for "${createRequestDto.jobTitle}" has been submitted.`,
        { requestId: savedRequest.requestId }
      ),
    ]);

    return savedRequest;
  }

  async findAllRequests(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: string;
      serviceType?: string;
      employerId?: string;
    }
  ): Promise<{ requests: RecruitmentRequest[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.serviceType) query.serviceType = filters.serviceType;
      if (filters.employerId) query.employerId = filters.employerId;
    }

    const [requests, total] = await Promise.all([
      this.recruitmentRequestModel.find(query)
        .populate('employerId', 'email')
        .populate('assignedRecruiter', 'email firstName lastName')
        .populate('assignedManager', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.recruitmentRequestModel.countDocuments(query).exec(),
    ]);

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRequestById(requestId: string): Promise<RecruitmentRequest> {
    const request = await this.recruitmentRequestModel.findOne({ requestId })
      .populate('employerId', 'email')
      .populate('assignedRecruiter', 'email firstName lastName')
      .populate('assignedManager', 'email firstName lastName')
      .exec();

    if (!request) {
      throw new NotFoundException(`Recruitment request with ID ${requestId} not found`);
    }

    return request;
  }

  async findRequestsByEmployer(employerId: string): Promise<RecruitmentRequest[]> {
    return this.recruitmentRequestModel.find({ employerId })
      .populate('assignedRecruiter', 'email firstName lastName')
      .populate('assignedManager', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateRequestStatus(
    requestId: string,
    updateStatusDto: UpdateRecruitmentStatusDto,
    updatedBy: string
  ): Promise<RecruitmentRequest> {
    const request = await this.recruitmentRequestModel.findOne({ requestId });

    if (!request) {
      throw new NotFoundException(`Recruitment request with ID ${requestId} not found`);
    }

    // Add to status history
    request.statusHistory.push({
      date: new Date(),
      status: updateStatusDto.status,
      note: updateStatusDto.note || '',
      updatedBy,
    });

    request.status = updateStatusDto.status as RecruitmentStatus;
    const updatedRequest = await request.save();

    // Send notification to employer
    await this.notificationService.createNotification({
      userId: request.employerId.toString(),
      title: "Recruitment Status Updated",
      message: `Your recruitment request status has been updated to: ${updateStatusDto.status}`,
      type: NotificationType.SYSTEM_UPDATE,
      data: { requestId: request.requestId, newStatus: updateStatusDto.status },
    });

    return updatedRequest;
  }

  async assignRecruiter(
    requestId: string,
    assignRecruiterDto: AssignRecruiterDto,
    assignedBy: string
  ): Promise<RecruitmentRequest> {
    const request = await this.recruitmentRequestModel.findOne({ requestId });

    if (!request) {
      throw new NotFoundException(`Recruitment request with ID ${requestId} not found`);
    }

    // Verify recruiter exists
    const recruiter = await this.userService.findById(assignRecruiterDto.recruiterId);
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    request.assignedRecruiter = assignRecruiterDto.recruiterId;
    if (assignRecruiterDto.managerId) {
      const manager = await this.userService.findById(assignRecruiterDto.managerId);
      if (!manager) {
        throw new NotFoundException('Manager not found');
      }
      request.assignedManager = assignRecruiterDto.managerId;
    }

    // Add to status history
    request.statusHistory.push({
      date: new Date(),
      status: 'recruiter_assigned',
      note: `Recruiter assigned: ${recruiter.email}`,
      updatedBy: assignedBy,
    });

    const updatedRequest = await request.save();

    // Send notifications
    await Promise.all([
      this.notificationService.createNotification({
        userId: request.employerId.toString(),
        title: "Recruiter Assigned",
        message: `A recruiter has been assigned to your recruitment request "${request.jobTitle}".`,
        type: NotificationType.ADVISOR_ASSIGNED,
        data: { requestId: request.requestId, recruiterId: assignRecruiterDto.recruiterId },
      }),
      this.notificationService.createNotification({
        userId: assignRecruiterDto.recruiterId,
        title: "New Recruitment Assignment",
        message: `You have been assigned to recruitment request "${request.jobTitle}".`,
        type: NotificationType.ADVISOR_ASSIGNED,
        data: { requestId: request.requestId },
      }),
    ]);

    return updatedRequest;
  }

  async addCandidate(
    requestId: string,
    addCandidateDto: AddCandidateDto,
    addedBy: string
  ): Promise<RecruitmentCandidate> {
    const request = await this.findRequestById(requestId);

    // Verify candidate exists
    const candidate = await this.userService.findById(addCandidateDto.candidateId);
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    // Check if candidate already added to this request
    const existingCandidate = await this.recruitmentCandidateModel.findOne({
      recruitmentRequestId: request._id,
      candidateId: addCandidateDto.candidateId,
    });

    if (existingCandidate) {
      throw new BadRequestException('Candidate already added to this recruitment request');
    }

    const recruitmentCandidate = new this.recruitmentCandidateModel({
      recruitmentRequestId: request._id,
      candidateId: addCandidateDto.candidateId,
      employerId: request.employerId,
      candidateProfile: addCandidateDto.candidateProfile,
      documents: addCandidateDto.documents || [],
      statusHistory: [{
        date: new Date(),
        status: 'sourced',
        note: 'Candidate added to recruitment request',
        updatedBy: addedBy,
      }],
    });

    const savedCandidate = await recruitmentCandidate.save();

    // Send notification to candidate
    await this.notificationService.createNotification({
      userId: addCandidateDto.candidateId,
      title: "Job Opportunity",
      message: `You have been considered for a job opportunity: "${request.jobTitle}".`,
      type: NotificationType.SYSTEM_UPDATE,
      data: { requestId: request.requestId, jobTitle: request.jobTitle },
    });

    return savedCandidate;
  }

  async getCandidates(
    requestId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ candidates: RecruitmentCandidate[]; total: number; page: number; totalPages: number }> {
    const request = await this.findRequestById(requestId);
    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      this.recruitmentCandidateModel.find({ recruitmentRequestId: request._id })
        .populate('candidateId', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.recruitmentCandidateModel.countDocuments({ recruitmentRequestId: request._id }).exec(),
    ]);

    return {
      candidates,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateCandidateStatus(
    candidateId: string,
    updateStatusDto: UpdateCandidateStatusDto,
    updatedBy: string
  ): Promise<RecruitmentCandidate> {
    const candidate = await this.recruitmentCandidateModel.findById(candidateId);

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    // Add to status history
    candidate.statusHistory.push({
      date: new Date(),
      status: updateStatusDto.status,
      note: updateStatusDto.note || '',
      updatedBy,
    });

    candidate.status = updateStatusDto.status;
    const updatedCandidate = await candidate.save();

    // Send notification to candidate
    await this.notificationService.createNotification({
      userId: candidate.candidateId.toString(),
      title: "Application Status Updated",
      message: `Your application status has been updated to: ${updateStatusDto.status}`,
      type: NotificationType.APPLICATION_STATUS_CHANGE,
      data: { candidateId: candidate._id, newStatus: updateStatusDto.status },
    });

    return updatedCandidate;
  }

  async scheduleInterview(
    candidateId: string,
    scheduleInterviewDto: ScheduleCandidateInterviewDto,
    scheduledBy: string
  ): Promise<RecruitmentCandidate> {
    const candidate = await this.recruitmentCandidateModel.findById(candidateId);

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    candidate.interviewDetails = {
      scheduledDate: new Date(scheduleInterviewDto.scheduledDate),
      interviewType: scheduleInterviewDto.interviewType,
      interviewerNotes: scheduleInterviewDto.notes,
    };

    candidate.status = 'interview_scheduled';

    // Add to status history
    candidate.statusHistory.push({
      date: new Date(),
      status: 'interview_scheduled',
      note: `Interview scheduled for ${scheduleInterviewDto.scheduledDate}`,
      updatedBy: scheduledBy,
    });

    const updatedCandidate = await candidate.save();

    // Send notification to candidate
    await this.notificationService.createNotification({
      userId: candidate.candidateId.toString(),
      title: "Interview Scheduled",
      message: `Your interview has been scheduled for ${scheduleInterviewDto.scheduledDate}`,
      type: NotificationType.MEETING_SCHEDULED,
      data: {
        candidateId: candidate._id,
        interviewDate: scheduleInterviewDto.scheduledDate,
        interviewType: scheduleInterviewDto.interviewType,
      },
    });

    return updatedCandidate;
  }

  async addInterviewFeedback(
    candidateId: string,
    feedbackDto: CandidateInterviewFeedbackDto,
    feedbackBy: string
  ): Promise<RecruitmentCandidate> {
    const candidate = await this.recruitmentCandidateModel.findById(candidateId);

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    if (!candidate.interviewDetails) {
      candidate.interviewDetails = {};
    }

    candidate.interviewDetails.feedback = feedbackDto.feedback;
    candidate.interviewDetails.rating = feedbackDto.rating;
    candidate.interviewDetails.interviewerNotes = feedbackDto.interviewerNotes;

    candidate.status = 'interviewed';

    // Add to status history
    candidate.statusHistory.push({
      date: new Date(),
      status: 'interviewed',
      note: `Interview completed with rating: ${feedbackDto.rating}/10`,
      updatedBy: feedbackBy,
    });

    const updatedCandidate = await candidate.save();

    // Send notification to candidate
    await this.notificationService.createNotification({
      userId: candidate.candidateId.toString(),
      title: "Interview Completed",
      message: "Your interview has been completed. We will get back to you soon.",
      type: NotificationType.SYSTEM_UPDATE,
      data: { candidateId: candidate._id },
    });

    return updatedCandidate;
  }

  async getRecruitmentStats(employerId?: string): Promise<any> {
    const query = employerId ? { employerId } : {};

    const [
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      totalCandidates,
      shortlistedCandidates,
      hiredCandidates,
    ] = await Promise.all([
      this.recruitmentRequestModel.countDocuments(query),
      this.recruitmentRequestModel.countDocuments({ ...query, status: RecruitmentStatus.PENDING }),
      this.recruitmentRequestModel.countDocuments({ ...query, status: RecruitmentStatus.IN_PROGRESS }),
      this.recruitmentRequestModel.countDocuments({ ...query, status: RecruitmentStatus.COMPLETED }),
      this.recruitmentCandidateModel.countDocuments(employerId ? { employerId } : {}),
      this.recruitmentCandidateModel.countDocuments({
        ...(employerId ? { employerId } : {}),
        status: 'shortlisted'
      }),
      this.recruitmentCandidateModel.countDocuments({
        ...(employerId ? { employerId } : {}),
        status: 'hired'
      }),
    ]);

    return {
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      totalCandidates,
      shortlistedCandidates,
      hiredCandidates,
    };
  }

  private async notifyAdmins(title: string, message: string, data?: any): Promise<void> {
    const admins = await this.userService.findByRole('admin' as any);
    const notifications = admins.map(admin =>
      this.notificationService.createNotification({
        userId: admin.userId,
        title,
        message,
        type: NotificationType.SYSTEM_UPDATE,
        data,
      })
    );
    await Promise.all(notifications);
  }
}
