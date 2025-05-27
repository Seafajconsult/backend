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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const student_profile_schema_1 = require("../schemas/student-profile.schema");
const notification_service_1 = require("../../notification/notification.service");
const notification_schema_1 = require("../../notification/notification.schema");
let StudentProfileService = class StudentProfileService {
    constructor(studentProfileModel, notificationService) {
        this.studentProfileModel = studentProfileModel;
        this.notificationService = notificationService;
    }
    calculateCompletionPercentage(profile) {
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
            }
            else {
                profile.completionStatus[section] = false;
            }
        }
        return Math.round((completedSections / totalSections) * 100);
    }
    async findByUserId(userId) {
        const profile = await this.studentProfileModel.findOne({ userId }).exec();
        if (!profile) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        return profile;
    }
    async update(userId, updateDto) {
        const profile = await this.findByUserId(userId);
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
        Object.assign(profile, updateDto);
        profile.completionPercentage = this.calculateCompletionPercentage(profile);
        profile.updateHistory.push(...changes);
        const updatedProfile = await profile.save();
        if (changes.length > 0) {
            await this.notificationService.createNotification({
                userId,
                title: 'Profile Updated',
                message: `Your profile has been updated. Current completion: ${profile.completionPercentage}%`,
                type: notification_schema_1.NotificationType.PROFILE_UPDATE,
                data: { completionPercentage: profile.completionPercentage }
            });
        }
        return updatedProfile;
    }
    async getProfileCompletionStatus(userId) {
        const profile = await this.findByUserId(userId);
        return {
            completionStatus: profile.completionStatus,
            completionPercentage: profile.completionPercentage
        };
    }
    async getProfileUpdateHistory(userId) {
        const profile = await this.findByUserId(userId);
        return profile.updateHistory;
    }
};
exports.StudentProfileService = StudentProfileService;
exports.StudentProfileService = StudentProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_profile_schema_1.StudentProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notification_service_1.NotificationService])
], StudentProfileService);
//# sourceMappingURL=student-profile.service.js.map