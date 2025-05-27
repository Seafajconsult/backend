import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentProfile } from '../schemas/student-profile.schema';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '../../notification/notification.schema';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectModel(StudentProfile.name)
    private studentProfileModel: Model<StudentProfile>,
    private readonly notificationService: NotificationService,
  ) {}

  async calculateProfileCompletion(userId: string): Promise<{ completionPercentage: number }> {
    const profile = await this.findByUserId(userId);
    return {
      completionPercentage: this.calculateCompletionPercentage(profile)
    };
  }

  async getUpdateHistory(userId: string) {
    const profile = await this.findByUserId(userId);
    return profile.updateHistory.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  private calculateCompletionPercentage(profile: StudentProfile): number {
    const requiredFields = {
      personalInfo: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality'],
      contactInfo: ['phone', 'address'],
      emergencyContact: ['emergencyContact'],
      education: ['education'],
      testScores: ['testScores'],
      workExperience: ['workExperience'],
      documents: ['passportNumber', 'passportExpiryDate']
    };

    let completedSections = 0;
    let totalSections = Object.keys(requiredFields).length;

    for (const [section, fields] of Object.entries(requiredFields)) {
      const isComplete = fields.every(field => {
        const value = profile[field];
        return value && (Array.isArray(value) ? value.length > 0 : true);
      });

      if (isComplete) {
        completedSections++;
        profile.completionStatus[section] = true;
      } else {
        profile.completionStatus[section] = false;
      }
    }

    return Math.round((completedSections / totalSections) * 100);
  }

  async findByUserId(userId: string): Promise<StudentProfile> {
    const profile = await this.studentProfileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    return profile;
  }

  async update(userId: string, updateDto: UpdateStudentProfileDto): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);

    // Record changes for history
    const changes = [];
    for (const [key, newValue] of Object.entries(updateDto)) {
      const oldValue = profile[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key,
          oldValue,
          newValue,
          updatedAt: new Date(),
          updatedBy: userId
        });
      }
    }

    // Update profile
    Object.assign(profile, updateDto);

    // Calculate completion percentage
    profile.completionPercentage = this.calculateCompletionPercentage(profile);

    // Add changes to history
    profile.updateHistory.push(...changes);

    // Save and notify if completion percentage changes significantly
    const updatedProfile = await profile.save();

    if (changes.length > 0) {
      await this.notificationService.createNotification({
        userId,
        title: 'Profile Updated',
        message: `Your profile has been updated. Current completion: ${profile.completionPercentage}%`,
        type: NotificationType.SYSTEM_UPDATE,
        data: { completionPercentage: profile.completionPercentage }
      });
    }

    return updatedProfile;
  }

  async getProfileCompletionStatus(userId: string) {
    const profile = await this.findByUserId(userId);
    return {
      completionStatus: profile.completionStatus,
      completionPercentage: profile.completionPercentage
    };
  }


}
