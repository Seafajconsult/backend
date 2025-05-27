import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Terms, TermsAcceptance, TermsStatus, TermsType } from "./terms.schema";
import { CreateTermsDto, UpdateTermsDto, AcceptTermsDto, WithdrawConsentDto } from "./dto/terms.dto";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.schema";

@Injectable()
export class TermsService {
  constructor(
    @InjectModel(Terms.name) private readonly termsModel: Model<Terms>,
    @InjectModel(TermsAcceptance.name) private readonly termsAcceptanceModel: Model<TermsAcceptance>,
    private readonly notificationService: NotificationService,
  ) {}

  async createTerms(createTermsDto: CreateTermsDto, createdBy: string): Promise<Terms> {
    // Check if there's already an active version of this type
    const existingActiveTerms = await this.termsModel.findOne({
      type: createTermsDto.type,
      status: TermsStatus.ACTIVE,
    });

    if (existingActiveTerms) {
      throw new BadRequestException(`Active terms of type ${createTermsDto.type} already exist. Archive the current version first.`);
    }

    const terms = new this.termsModel({
      ...createTermsDto,
      effectiveDate: new Date(createTermsDto.effectiveDate),
      expiryDate: createTermsDto.expiryDate ? new Date(createTermsDto.expiryDate) : undefined,
      createdBy,
    });

    return terms.save();
  }

  async updateTerms(termsId: string, updateTermsDto: UpdateTermsDto): Promise<Terms> {
    const terms = await this.termsModel.findById(termsId);
    if (!terms) {
      throw new NotFoundException('Terms not found');
    }

    if (terms.status === TermsStatus.ACTIVE) {
      throw new BadRequestException('Cannot update active terms. Create a new version instead.');
    }

    Object.assign(terms, {
      ...updateTermsDto,
      effectiveDate: updateTermsDto.effectiveDate ? new Date(updateTermsDto.effectiveDate) : terms.effectiveDate,
      expiryDate: updateTermsDto.expiryDate ? new Date(updateTermsDto.expiryDate) : terms.expiryDate,
    });

    return terms.save();
  }

  async activateTerms(termsId: string, approvedBy: string): Promise<Terms> {
    const terms = await this.termsModel.findById(termsId);
    if (!terms) {
      throw new NotFoundException('Terms not found');
    }

    // Archive any existing active terms of the same type
    await this.termsModel.updateMany(
      { type: terms.type, status: TermsStatus.ACTIVE },
      { status: TermsStatus.ARCHIVED }
    );

    terms.status = TermsStatus.ACTIVE;
    terms.approvedBy = approvedBy;
    terms.approvedAt = new Date();

    const activatedTerms = await terms.save();

    // Notify users who need to accept these terms
    await this.notifyUsersOfNewTerms(activatedTerms);

    return activatedTerms;
  }

  async getActiveTerms(type?: TermsType): Promise<Terms[]> {
    const query: any = { status: TermsStatus.ACTIVE };
    if (type) {
      query.type = type;
    }

    return this.termsModel.find(query)
      .populate('createdBy', 'email firstName lastName')
      .populate('approvedBy', 'email firstName lastName')
      .sort({ effectiveDate: -1 })
      .exec();
  }

  async getTermsById(termsId: string): Promise<Terms> {
    const terms = await this.termsModel.findById(termsId)
      .populate('createdBy', 'email firstName lastName')
      .populate('approvedBy', 'email firstName lastName')
      .exec();

    if (!terms) {
      throw new NotFoundException('Terms not found');
    }

    return terms;
  }

  async getAllTerms(
    page: number = 1,
    limit: number = 10,
    filters?: {
      type?: string;
      status?: string;
    }
  ): Promise<{ terms: Terms[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters) {
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
    }

    const [terms, total] = await Promise.all([
      this.termsModel.find(query)
        .populate('createdBy', 'email firstName lastName')
        .populate('approvedBy', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.termsModel.countDocuments(query).exec(),
    ]);

    return {
      terms,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async acceptTerms(userId: string, acceptTermsDto: AcceptTermsDto): Promise<TermsAcceptance> {
    const terms = await this.getTermsById(acceptTermsDto.termsId);

    if (terms.status !== TermsStatus.ACTIVE) {
      throw new BadRequestException('Terms are not active');
    }

    // Check if user has already accepted this version
    const existingAcceptance = await this.termsAcceptanceModel.findOne({
      userId,
      termsId: acceptTermsDto.termsId,
      termsVersion: terms.version,
      isAccepted: true,
    });

    if (existingAcceptance) {
      throw new BadRequestException('Terms already accepted');
    }

    const acceptance = new this.termsAcceptanceModel({
      userId,
      termsId: acceptTermsDto.termsId,
      termsVersion: terms.version,
      acceptedAt: new Date(),
      ipAddress: acceptTermsDto.ipAddress,
      userAgent: acceptTermsDto.userAgent,
    });

    const savedAcceptance = await acceptance.save();

    // Send notification
    await this.notificationService.createNotification({
      userId,
      title: "Terms Accepted",
      message: `You have successfully accepted the ${terms.title}.`,
      type: NotificationType.SYSTEM_UPDATE,
      data: { termsId: terms._id, termsType: terms.type },
    });

    return savedAcceptance;
  }

  async withdrawConsent(userId: string, acceptanceId: string, withdrawDto: WithdrawConsentDto): Promise<TermsAcceptance> {
    const acceptance = await this.termsAcceptanceModel.findOne({
      _id: acceptanceId,
      userId,
      isAccepted: true,
    });

    if (!acceptance) {
      throw new NotFoundException('Terms acceptance not found');
    }

    acceptance.isAccepted = false;
    acceptance.withdrawnAt = new Date();
    acceptance.withdrawalReason = withdrawDto.reason;

    const updatedAcceptance = await acceptance.save();

    // Send notification
    await this.notificationService.createNotification({
      userId,
      title: "Consent Withdrawn",
      message: `You have withdrawn your consent for the terms. This may affect your access to certain services.`,
      type: NotificationType.SYSTEM_UPDATE,
      data: { acceptanceId: acceptance._id },
    });

    return updatedAcceptance;
  }

  async getUserAcceptances(userId: string): Promise<TermsAcceptance[]> {
    return this.termsAcceptanceModel.find({ userId })
      .populate('termsId')
      .sort({ acceptedAt: -1 })
      .exec();
  }

  async checkUserCompliance(userId: string, userRole: string): Promise<{
    isCompliant: boolean;
    pendingTerms: Terms[];
    acceptedTerms: TermsAcceptance[];
  }> {
    // Get all active terms applicable to user's role
    const applicableTerms = await this.termsModel.find({
      status: TermsStatus.ACTIVE,
      applicableRoles: { $in: [userRole] },
      isRequired: true,
    });

    // Get user's acceptances
    const userAcceptances = await this.termsAcceptanceModel.find({
      userId,
      isAccepted: true,
    }).populate('termsId');

    // Check which terms are pending acceptance
    const acceptedTermsIds = userAcceptances.map(acc => acc.termsId.toString());
    const pendingTerms = applicableTerms.filter(term => !acceptedTermsIds.includes(term._id.toString()));

    return {
      isCompliant: pendingTerms.length === 0,
      pendingTerms,
      acceptedTerms: userAcceptances,
    };
  }

  async getTermsStats(): Promise<any> {
    const [
      totalTerms,
      activeTerms,
      draftTerms,
      archivedTerms,
      totalAcceptances,
      uniqueUsersAccepted,
    ] = await Promise.all([
      this.termsModel.countDocuments(),
      this.termsModel.countDocuments({ status: TermsStatus.ACTIVE }),
      this.termsModel.countDocuments({ status: TermsStatus.DRAFT }),
      this.termsModel.countDocuments({ status: TermsStatus.ARCHIVED }),
      this.termsAcceptanceModel.countDocuments({ isAccepted: true }),
      this.termsAcceptanceModel.distinct('userId', { isAccepted: true }).then(users => users.length),
    ]);

    return {
      totalTerms,
      activeTerms,
      draftTerms,
      archivedTerms,
      totalAcceptances,
      uniqueUsersAccepted,
    };
  }

  private async notifyUsersOfNewTerms(terms: Terms): Promise<void> {
    // This would typically involve finding all users with applicable roles
    // and sending them notifications about new terms
    // Implementation depends on your user management system
    
    // For now, we'll just log that new terms are active
    console.log(`New terms activated: ${terms.title} (${terms.type})`);
  }
}
