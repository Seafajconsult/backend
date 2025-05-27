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
exports.StudentProfileSchema = exports.StudentProfile = exports.MaritalStatus = exports.Gender = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
    Gender["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
})(Gender || (exports.Gender = Gender = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["DIVORCED"] = "divorced";
    MaritalStatus["WIDOWED"] = "widowed";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
let StudentProfile = class StudentProfile extends mongoose_2.Document {
};
exports.StudentProfile = StudentProfile;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], StudentProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StudentProfile.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StudentProfile.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StudentProfile.prototype, "middleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], StudentProfile.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Gender }),
    __metadata("design:type", String)
], StudentProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: MaritalStatus }),
    __metadata("design:type", String)
], StudentProfile.prototype, "maritalStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StudentProfile.prototype, "nationality", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StudentProfile.prototype, "passportNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StudentProfile.prototype, "passportExpiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StudentProfile.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StudentProfile.prototype, "alternativeEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "emergencyContact", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            institution: String,
            degree: String,
            field: String,
            startDate: Date,
            endDate: Date,
            gpa: Number,
            country: String
        }]),
    __metadata("design:type", Array)
], StudentProfile.prototype, "education", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            type: String,
            score: Number,
            dateOfTest: Date,
            expiryDate: Date
        }]),
    __metadata("design:type", Array)
], StudentProfile.prototype, "testScores", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            company: String,
            position: String,
            startDate: Date,
            endDate: Date,
            description: String,
            country: String
        }]),
    __metadata("design:type", Array)
], StudentProfile.prototype, "workExperience", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "completionStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], StudentProfile.prototype, "completionPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            field: String,
            oldValue: mongoose.Schema.Types.Mixed,
            newValue: mongoose.Schema.Types.Mixed,
            updatedAt: { type: Date, default: Date.now },
            updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }]),
    __metadata("design:type", Array)
], StudentProfile.prototype, "updateHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "preferences", void 0);
exports.StudentProfile = StudentProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StudentProfile);
exports.StudentProfileSchema = mongoose_1.SchemaFactory.createForClass(StudentProfile);
//# sourceMappingURL=student-profile.schema.js.map