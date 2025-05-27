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
exports.UserDocumentSchema = exports.UserDocument = exports.DocumentStatus = exports.DocumentType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
var DocumentType;
(function (DocumentType) {
    DocumentType["PASSPORT"] = "passport";
    DocumentType["NATIONAL_ID"] = "national_id";
    DocumentType["BIRTH_CERTIFICATE"] = "birth_certificate";
    DocumentType["TRANSCRIPT"] = "transcript";
    DocumentType["DEGREE_CERTIFICATE"] = "degree_certificate";
    DocumentType["PROVISIONAL_CERTIFICATE"] = "provisional_certificate";
    DocumentType["ENGLISH_TEST"] = "english_test";
    DocumentType["OTHER_TEST"] = "other_test";
    DocumentType["BANK_STATEMENT"] = "bank_statement";
    DocumentType["SPONSORSHIP_LETTER"] = "sponsorship_letter";
    DocumentType["SCHOLARSHIP_LETTER"] = "scholarship_letter";
    DocumentType["VISA_APPLICATION"] = "visa_application";
    DocumentType["PREVIOUS_VISA"] = "previous_visa";
    DocumentType["RESUME"] = "resume";
    DocumentType["RECOMMENDATION_LETTER"] = "recommendation_letter";
    DocumentType["WORK_EXPERIENCE"] = "work_experience";
    DocumentType["STATEMENT_OF_PURPOSE"] = "statement_of_purpose";
    DocumentType["OFFER_LETTER"] = "offer_letter";
    DocumentType["ACCEPTANCE_LETTER"] = "acceptance_letter";
    DocumentType["BUSINESS_REGISTRATION"] = "business_registration";
    DocumentType["TAX_CERTIFICATE"] = "tax_certificate";
    DocumentType["PHOTOGRAPH"] = "photograph";
    DocumentType["OTHER"] = "other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "pending";
    DocumentStatus["UNDER_REVIEW"] = "under_review";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["EXPIRED"] = "expired";
    DocumentStatus["REQUIRES_UPDATE"] = "requires_update";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let UserDocument = class UserDocument extends mongoose_2.Document {
};
exports.UserDocument = UserDocument;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "originalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "cloudinaryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "cloudinaryUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: DocumentType }),
    __metadata("design:type", String)
], UserDocument.prototype, "documentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: DocumentStatus,
        default: DocumentStatus.PENDING,
    }),
    __metadata("design:type", String)
], UserDocument.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserDocument.prototype, "rejectionReason", void 0);
exports.UserDocument = UserDocument = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserDocument);
exports.UserDocumentSchema = mongoose_1.SchemaFactory.createForClass(UserDocument);
//# sourceMappingURL=document.schema.js.map