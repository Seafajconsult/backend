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
exports.ApplicationSchema = exports.Application = exports.ApplicationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["DRAFT"] = "draft";
    ApplicationStatus["SUBMITTED"] = "submitted";
    ApplicationStatus["DOCUMENT_REVIEW"] = "document_review";
    ApplicationStatus["DOCUMENTS_APPROVED"] = "documents_approved";
    ApplicationStatus["DOCUMENTS_REJECTED"] = "documents_rejected";
    ApplicationStatus["SENT_TO_SCHOOL"] = "sent_to_school";
    ApplicationStatus["SCHOOL_REVIEWING"] = "school_reviewing";
    ApplicationStatus["ADDITIONAL_DOCS_REQUIRED"] = "additional_docs_required";
    ApplicationStatus["INTERVIEW_SCHEDULED"] = "interview_scheduled";
    ApplicationStatus["INTERVIEW_COMPLETED"] = "interview_completed";
    ApplicationStatus["OFFER_RECEIVED"] = "offer_received";
    ApplicationStatus["OFFER_ACCEPTED"] = "offer_accepted";
    ApplicationStatus["OFFER_REJECTED"] = "offer_rejected";
    ApplicationStatus["VISA_PROCESSING"] = "visa_processing";
    ApplicationStatus["VISA_APPROVED"] = "visa_approved";
    ApplicationStatus["VISA_REJECTED"] = "visa_rejected";
    ApplicationStatus["PRE_DEPARTURE"] = "pre_departure";
    ApplicationStatus["COMPLETED"] = "completed";
    ApplicationStatus["CANCELLED"] = "cancelled";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
let Application = class Application extends mongoose_2.Document {
};
exports.Application = Application;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", String)
], Application.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Application.prototype, "applicationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", String)
], Application.prototype, "employerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "course", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "university", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "intake", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ApplicationStatus,
        default: ApplicationStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }] }),
    __metadata("design:type", Array)
], Application.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Application.prototype, "academicDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Application.prototype, "visaDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Application.prototype, "offerDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Application.prototype, "preDepartureDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", String)
], Application.prototype, "assignedAdvisor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ date: Date, status: String, note: String }] }),
    __metadata("design:type", Array)
], Application.prototype, "statusHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Application.prototype, "metadata", void 0);
exports.Application = Application = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Application);
exports.ApplicationSchema = mongoose_1.SchemaFactory.createForClass(Application);
//# sourceMappingURL=application.schema.js.map