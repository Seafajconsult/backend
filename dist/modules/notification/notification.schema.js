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
exports.NotificationSchema = exports.Notification = exports.NotificationChannel = exports.NotificationPriority = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["DOCUMENT_UPLOADED"] = "document_uploaded";
    NotificationType["DOCUMENT_VERIFIED"] = "document_verified";
    NotificationType["DOCUMENT_REJECTED"] = "document_rejected";
    NotificationType["DOCUMENT_EXPIRING"] = "document_expiring";
    NotificationType["APPLICATION_SUBMITTED"] = "application_submitted";
    NotificationType["APPLICATION_STATUS_CHANGE"] = "application_status_change";
    NotificationType["APPLICATION_REVIEW"] = "application_review";
    NotificationType["OFFER_RECEIVED"] = "offer_received";
    NotificationType["PAYMENT_INITIATED"] = "payment_initiated";
    NotificationType["PAYMENT_SUCCESSFUL"] = "payment_successful";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["INVOICE_GENERATED"] = "invoice_generated";
    NotificationType["VISA_APPOINTMENT"] = "visa_appointment";
    NotificationType["VISA_STATUS_UPDATE"] = "visa_status_update";
    NotificationType["VISA_APPROVED"] = "visa_approved";
    NotificationType["VISA_REJECTED"] = "visa_rejected";
    NotificationType["NEW_MESSAGE"] = "new_message";
    NotificationType["ADVISOR_ASSIGNED"] = "advisor_assigned";
    NotificationType["MEETING_SCHEDULED"] = "meeting_scheduled";
    NotificationType["NEW_REFERRAL"] = "new_referral";
    NotificationType["REFERRAL_REGISTERED"] = "referral_registered";
    NotificationType["REFERRAL_BONUS"] = "referral_bonus";
    NotificationType["FLIGHT_REMINDER"] = "flight_reminder";
    NotificationType["ORIENTATION_REMINDER"] = "orientation_reminder";
    NotificationType["ACCOMMODATION_UPDATE"] = "accommodation_update";
    NotificationType["ACCOUNT_UPDATE"] = "account_update";
    NotificationType["PROFILE_INCOMPLETE"] = "profile_incomplete";
    NotificationType["MAINTENANCE"] = "maintenance";
    NotificationType["SYSTEM_UPDATE"] = "system_update";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["PUSH"] = "push";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
let Notification = class Notification extends mongoose_2.Document {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: NotificationPriority, default: NotificationPriority.MEDIUM }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: NotificationChannel, default: [NotificationChannel.IN_APP] }),
    __metadata("design:type", Array)
], Notification.prototype, "channels", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isArchived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Notification.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Notification.prototype, "scheduledFor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Notification.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
//# sourceMappingURL=notification.schema.js.map