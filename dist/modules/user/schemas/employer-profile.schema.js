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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerProfileSchema = exports.EmployerProfile = exports.SubscriptionTier = exports.EmployerStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
var EmployerStatus;
(function (EmployerStatus) {
    EmployerStatus["PENDING"] = "pending";
    EmployerStatus["ACTIVE"] = "active";
    EmployerStatus["SUSPENDED"] = "suspended";
    EmployerStatus["INACTIVE"] = "inactive";
})(EmployerStatus || (exports.EmployerStatus = EmployerStatus = {}));
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["NONE"] = "none";
    SubscriptionTier["BASIC"] = "basic";
    SubscriptionTier["PREMIUM"] = "premium";
    SubscriptionTier["ENTERPRISE"] = "enterprise";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
let EmployerProfile = class EmployerProfile extends mongoose_2.Document {
};
exports.EmployerProfile = EmployerProfile;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "businessRegistrationNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "contactPersonName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "contactPersonPosition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "industry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "companySize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmployerProfile.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: EmployerStatus, default: EmployerStatus.PENDING }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: SubscriptionTier, default: SubscriptionTier.NONE }),
    __metadata("design:type", String)
], EmployerProfile.prototype, "subscriptionTier", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmployerProfile.prototype, "subscriptionExpiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }] }),
    __metadata("design:type", Array)
], EmployerProfile.prototype, "verificationDocuments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], EmployerProfile.prototype, "metadata", void 0);
exports.EmployerProfile = EmployerProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EmployerProfile);
exports.EmployerProfileSchema = mongoose_1.SchemaFactory.createForClass(EmployerProfile);
//# sourceMappingURL=employer-profile.schema.js.map