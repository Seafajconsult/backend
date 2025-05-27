import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Referral, ReferralReward, ReferralProgram, ReferralStatus, RewardStatus } from "./referral.schema";
import { ProcessReferralDto, UpdateReferralStatusDto, CreateReferralProgramDto, CreateRewardDto, UpdateRewardStatusDto, ProcessRewardPaymentDto } from "./dto/referral.dto";
import { UserService } from "../user/user.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.schema";

@Injectable()
export class ReferralService {
  constructor(
    @InjectModel(Referral.name) private readonly referralModel: Model<Referral>,
    @InjectModel(ReferralReward.name) private readonly referralRewardModel: Model<ReferralReward>,
    @InjectModel(ReferralProgram.name) private readonly referralProgramModel: Model<ReferralProgram>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async generateReferralId(): Promise<string> {
    while (true) {
      const referralId = `REF-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const existingReferral = await this.referralModel.findOne({ referralId });
      if (!existingReferral) {
        return referralId;
      }
    }
  }

  async generateRewardId(): Promise<string> {
    while (true) {
      const rewardId = `RWD-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const existingReward = await this.referralRewardModel.findOne({ rewardId });
      if (!existingReward) {
        return rewardId;
      }
    }
  }

  async processReferral(processReferralDto: ProcessReferralDto): Promise<Referral> {
    // Find the referrer by referral code
    const referrer = await this.userService.findByReferralCode(processReferralDto.referralCode);
    if (!referrer) {
      throw new NotFoundException('Invalid referral code');
    }

    // Check if referee exists
    const referee = await this.userService.findById(processReferralDto.refereeId);
    if (!referee) {
      throw new NotFoundException('Referee not found');
    }

    // Check if referral already exists
    const existingReferral = await this.referralModel.findOne({
      referrerId: referrer._id,
      refereeId: processReferralDto.refereeId,
    });

    if (existingReferral) {
      throw new BadRequestException('Referral already exists for this user');
    }

    // Check if user is trying to refer themselves
    if (referrer._id.toString() === processReferralDto.refereeId) {
      throw new BadRequestException('Users cannot refer themselves');
    }

    const referralId = await this.generateReferralId();

    const referral = new this.referralModel({
      referralId,
      referrerId: referrer._id,
      refereeId: processReferralDto.refereeId,
      referralCode: processReferralDto.referralCode,
      referralDate: new Date(),
      qualificationCriteria: {
        emailVerified: false,
        profileCompleted: false,
        firstApplicationSubmitted: false,
        firstPaymentMade: false,
      },
    });

    const savedReferral = await referral.save();

    // Send notifications
    await Promise.all([
      this.notificationService.createNotification({
        userId: referrer.userId,
        title: "New Referral",
        message: `You have successfully referred a new user. Track their progress to earn rewards!`,
        type: NotificationType.NEW_REFERRAL,
        data: { referralId: savedReferral.referralId, refereeEmail: referee.email },
      }),
      this.notificationService.createNotification({
        userId: processReferralDto.refereeId,
        title: "Welcome! You were referred",
        message: `You were referred by ${referrer.email}. Complete your profile to unlock benefits!`,
        type: NotificationType.REFERRAL_REGISTERED,
        data: { referralId: savedReferral.referralId, referrerEmail: referrer.email },
      }),
    ]);

    return savedReferral;
  }

  async checkReferralQualification(refereeId: string): Promise<void> {
    const referrals = await this.referralModel.find({
      refereeId,
      status: ReferralStatus.PENDING
    });

    for (const referral of referrals) {
      const referee = await this.userService.findById(refereeId);
      if (!referee) continue;

      // Get active referral program
      const activeProgram = await this.getActiveReferralProgram();
      if (!activeProgram) continue;

      // Check qualification criteria
      const criteria = activeProgram.qualificationCriteria;
      const qualificationStatus = {
        emailVerified: criteria.emailVerification ? referee.isEmailVerified : true,
        profileCompleted: criteria.profileCompletion ? await this.checkProfileCompletion(refereeId) : true,
        firstApplicationSubmitted: criteria.firstApplication ? await this.checkFirstApplication(refereeId) : true,
        firstPaymentMade: criteria.firstPayment ? await this.checkFirstPayment(refereeId, criteria.minimumPaymentAmount) : true,
      };

      // Update referral qualification status
      referral.qualificationCriteria = qualificationStatus;

      // Check if all criteria are met
      const isQualified = Object.values(qualificationStatus).every(status => status === true);

      if (isQualified && referral.status === ReferralStatus.PENDING) {
        referral.status = ReferralStatus.QUALIFIED;
        referral.qualificationDate = new Date();

        await referral.save();

        // Create rewards for both referrer and referee
        await this.createReferralRewards(referral._id.toString(), activeProgram);

        // Send notifications
        await Promise.all([
          this.notificationService.createNotification({
            userId: referral.referrerId.toString(),
            title: "Referral Qualified!",
            message: `Your referral has qualified for rewards! Check your rewards section.`,
            type: NotificationType.REFERRAL_BONUS,
            data: { referralId: referral.referralId },
          }),
          this.notificationService.createNotification({
            userId: referral.refereeId.toString(),
            title: "Welcome Bonus Unlocked!",
            message: `You've unlocked your welcome bonus! Check your rewards section.`,
            type: NotificationType.REFERRAL_BONUS,
            data: { referralId: referral.referralId },
          }),
        ]);
      } else {
        await referral.save();
      }
    }
  }

  async createReferralRewards(referralId: string, program: ReferralProgram): Promise<void> {
    const referral = await this.referralModel.findById(referralId);
    if (!referral) return;

    // Create reward for referrer
    if (program.rewardConfig.referrerReward) {
      const referrerRewardId = await this.generateRewardId();
      const referrerReward = new this.referralRewardModel({
        rewardId: referrerRewardId,
        referralId: referral._id,
        userId: referral.referrerId,
        rewardType: program.rewardConfig.referrerReward.type,
        rewardValue: program.rewardConfig.referrerReward.value,
        currency: program.rewardConfig.referrerReward.currency,
        description: program.rewardConfig.referrerReward.description,
      });
      await referrerReward.save();
    }

    // Create reward for referee if configured
    if (program.rewardConfig.refereeReward) {
      const refereeRewardId = await this.generateRewardId();
      const refereeReward = new this.referralRewardModel({
        rewardId: refereeRewardId,
        referralId: referral._id,
        userId: referral.refereeId,
        rewardType: program.rewardConfig.refereeReward.type,
        rewardValue: program.rewardConfig.refereeReward.value,
        currency: program.rewardConfig.refereeReward.currency,
        description: program.rewardConfig.refereeReward.description,
      });
      await refereeReward.save();
    }
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return this.referralModel.find({ referrerId: userId })
      .populate('refereeId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserRewards(userId: string): Promise<ReferralReward[]> {
    return this.referralRewardModel.find({ userId })
      .populate('referralId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getReferralStats(userId?: string): Promise<any> {
    const query = userId ? { referrerId: userId } : {};

    const [
      totalReferrals,
      pendingReferrals,
      qualifiedReferrals,
      rewardedReferrals,
      totalRewards,
      pendingRewards,
      paidRewards,
      totalRewardValue,
    ] = await Promise.all([
      this.referralModel.countDocuments(query),
      this.referralModel.countDocuments({ ...query, status: ReferralStatus.PENDING }),
      this.referralModel.countDocuments({ ...query, status: ReferralStatus.QUALIFIED }),
      this.referralModel.countDocuments({ ...query, status: ReferralStatus.REWARDED }),
      this.referralRewardModel.countDocuments(userId ? { userId } : {}),
      this.referralRewardModel.countDocuments({
        ...(userId ? { userId } : {}),
        status: RewardStatus.PENDING
      }),
      this.referralRewardModel.countDocuments({
        ...(userId ? { userId } : {}),
        status: RewardStatus.PAID
      }),
      this.referralRewardModel.aggregate([
        { $match: userId ? { userId } : {} },
        { $group: { _id: null, total: { $sum: "$rewardValue" } } }
      ]).then(result => result[0]?.total || 0),
    ]);

    return {
      totalReferrals,
      pendingReferrals,
      qualifiedReferrals,
      rewardedReferrals,
      totalRewards,
      pendingRewards,
      paidRewards,
      totalRewardValue,
    };
  }

  private async getActiveReferralProgram(): Promise<ReferralProgram | null> {
    const now = new Date();
    return this.referralProgramModel.findOne({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).exec();
  }

  private async checkProfileCompletion(userId: string): Promise<boolean> {
    // Implementation depends on your profile completion logic
    // This is a placeholder - you should implement based on your requirements
    const user = await this.userService.findById(userId);
    return user?.firstName && user?.lastName ? true : false;
  }

  private async checkFirstApplication(userId: string): Promise<boolean> {
    // Check if user has submitted their first application
    // This would require integration with your application service
    return false; // Placeholder
  }

  private async checkFirstPayment(userId: string, minimumAmount?: number): Promise<boolean> {
    // Check if user has made their first payment
    // This would require integration with your payment service
    return false; // Placeholder
  }

  // Admin methods for managing referral programs
  async createReferralProgram(createProgramDto: CreateReferralProgramDto): Promise<ReferralProgram> {
    // Deactivate existing active programs if creating a new one
    await this.referralProgramModel.updateMany(
      { isActive: true },
      { isActive: false }
    );

    const program = new this.referralProgramModel({
      ...createProgramDto,
      startDate: new Date(createProgramDto.startDate),
      endDate: createProgramDto.endDate ? new Date(createProgramDto.endDate) : undefined,
    });

    return program.save();
  }

  async updateReferralStatus(
    referralId: string,
    updateStatusDto: UpdateReferralStatusDto
  ): Promise<Referral> {
    const referral = await this.referralModel.findOne({ referralId });
    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    referral.status = updateStatusDto.status as ReferralStatus;
    return referral.save();
  }

  async createReward(createRewardDto: CreateRewardDto): Promise<ReferralReward> {
    const rewardId = await this.generateRewardId();

    const reward = new this.referralRewardModel({
      ...createRewardDto,
      rewardId,
      expiryDate: createRewardDto.expiryDate ? new Date(createRewardDto.expiryDate) : undefined,
    });

    const savedReward = await reward.save();

    // Send notification
    await this.notificationService.createNotification({
      userId: createRewardDto.userId,
      title: "New Reward Available",
      message: `You have received a new reward: ${createRewardDto.description}`,
      type: NotificationType.REFERRAL_BONUS,
      data: { rewardId: savedReward.rewardId, rewardValue: createRewardDto.rewardValue },
    });

    return savedReward;
  }

  async updateRewardStatus(
    rewardId: string,
    updateStatusDto: UpdateRewardStatusDto
  ): Promise<ReferralReward> {
    const reward = await this.referralRewardModel.findOne({ rewardId });
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    reward.status = updateStatusDto.status;

    if (updateStatusDto.status === RewardStatus.APPROVED) {
      // Send notification about approval
      await this.notificationService.createNotification({
        userId: reward.userId.toString(),
        title: "Reward Approved",
        message: `Your reward has been approved and will be processed soon.`,
        type: NotificationType.REFERRAL_BONUS,
        data: { rewardId: reward.rewardId },
      });
    }

    return reward.save();
  }

  async processRewardPayment(
    rewardId: string,
    paymentDto: ProcessRewardPaymentDto
  ): Promise<ReferralReward> {
    const reward = await this.referralRewardModel.findOne({ rewardId });
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (reward.status !== RewardStatus.APPROVED) {
      throw new BadRequestException('Reward must be approved before payment can be processed');
    }

    reward.paymentDetails = {
      method: paymentDto.method,
      accountDetails: paymentDto.accountDetails,
      transactionId: paymentDto.transactionId,
      processingFee: paymentDto.processingFee,
    };

    reward.status = RewardStatus.PAID;
    reward.paidDate = new Date();

    const updatedReward = await reward.save();

    // Send notification
    await this.notificationService.createNotification({
      userId: reward.userId.toString(),
      title: "Reward Paid",
      message: `Your reward has been paid via ${paymentDto.method}. Transaction ID: ${paymentDto.transactionId}`,
      type: NotificationType.REFERRAL_BONUS,
      data: {
        rewardId: reward.rewardId,
        transactionId: paymentDto.transactionId,
        amount: reward.rewardValue,
      },
    });

    return updatedReward;
  }

  async getAllReferrals(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: string;
      referrerId?: string;
      refereeId?: string;
    }
  ): Promise<{ referrals: Referral[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.referrerId) query.referrerId = filters.referrerId;
      if (filters.refereeId) query.refereeId = filters.refereeId;
    }

    const [referrals, total] = await Promise.all([
      this.referralModel.find(query)
        .populate('referrerId', 'email firstName lastName')
        .populate('refereeId', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.referralModel.countDocuments(query).exec(),
    ]);

    return {
      referrals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllRewards(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: string;
      userId?: string;
      rewardType?: string;
    }
  ): Promise<{ rewards: ReferralReward[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.userId) query.userId = filters.userId;
      if (filters.rewardType) query.rewardType = filters.rewardType;
    }

    const [rewards, total] = await Promise.all([
      this.referralRewardModel.find(query)
        .populate('userId', 'email firstName lastName')
        .populate('referralId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.referralRewardModel.countDocuments(query).exec(),
    ]);

    return {
      rewards,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
