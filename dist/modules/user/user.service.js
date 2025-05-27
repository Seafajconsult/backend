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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async generateUniqueUserId() {
        while (true) {
            const userId = Math.floor(100000000 + Math.random() * 900000000).toString();
            const existingUser = await this.userModel.findOne({ userId });
            if (!existingUser) {
                return userId;
            }
        }
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(userId) {
        return this.userModel.findOne({ userId }).exec();
    }
    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    async findByReferralCode(referralCode) {
        return this.userModel.findOne({ referralCode }).exec();
    }
    async create(userData) {
        let referralCode = userData.referralCode;
        if (referralCode) {
            const referrer = await this.findByReferralCode(referralCode);
            if (!referrer) {
                throw new common_1.BadRequestException('Invalid referral code');
            }
        }
        const newUser = new this.userModel({
            ...userData,
            referralCode: this.generateReferralCode(),
        });
        const savedUser = await newUser.save();
        if (referralCode) {
            const referrer = await this.findByReferralCode(referralCode);
            if (referrer) {
                await this.userModel.findByIdAndUpdate(referrer._id, { $push: { referrals: savedUser._id } }, { new: true });
                await this.userModel.findByIdAndUpdate(savedUser._id, { referredBy: referrer._id }, { new: true });
            }
        }
        return savedUser;
    }
    async markEmailAsVerified(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        user.isEmailVerified = true;
        return user.save();
    }
    async updatePassword(userId, newPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        user.password = newPassword;
        return user.save();
    }
    async findAll(role) {
        const query = role ? { role } : {};
        return this.userModel.find(query).exec();
    }
    async findByRole(role) {
        return this.userModel.find({ role }).exec();
    }
    async count() {
        return this.userModel.countDocuments().exec();
    }
    async countByRole(role) {
        return this.userModel.countDocuments({ role }).exec();
    }
    async update(userId, updateUserDto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        Object.assign(user, updateUserDto);
        return user.save();
    }
    async delete(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return this.userModel.findOneAndDelete({ userId }).exec();
    }
    async getReferralStats(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const [referredUsers, referredBy] = await Promise.all([
            this.userModel.find({ referredBy: user._id }).select('-password').exec(),
            user.referredBy ? this.userModel.findById(user.referredBy).select('-password').exec() : null,
        ]);
        return {
            totalReferrals: referredUsers.length,
            referredUsers,
            referredBy,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map