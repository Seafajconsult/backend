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
exports.TestimonialSchema = exports.Testimonial = exports.TestimonialStatus = exports.TestimonialType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
var TestimonialType;
(function (TestimonialType) {
    TestimonialType["TEXT"] = "text";
    TestimonialType["VIDEO"] = "video";
})(TestimonialType || (exports.TestimonialType = TestimonialType = {}));
var TestimonialStatus;
(function (TestimonialStatus) {
    TestimonialStatus["PENDING"] = "pending";
    TestimonialStatus["APPROVED"] = "approved";
    TestimonialStatus["REJECTED"] = "rejected";
})(TestimonialStatus || (exports.TestimonialStatus = TestimonialStatus = {}));
let Testimonial = class Testimonial extends mongoose_2.Document {
};
exports.Testimonial = Testimonial;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Testimonial.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: TestimonialType }),
    __metadata("design:type", String)
], Testimonial.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Testimonial.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Testimonial.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Testimonial.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Testimonial.prototype, "university", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Testimonial.prototype, "course", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Testimonial.prototype, "yearOfAdmission", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Testimonial.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Testimonial.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: TestimonialStatus, default: TestimonialStatus.PENDING }),
    __metadata("design:type", String)
], Testimonial.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Testimonial.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Testimonial.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], Testimonial.prototype, "likedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Testimonial.prototype, "featured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], Testimonial.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Testimonial.prototype, "reviewedAt", void 0);
exports.Testimonial = Testimonial = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Testimonial);
exports.TestimonialSchema = mongoose_1.SchemaFactory.createForClass(Testimonial);
//# sourceMappingURL=testimonial.schema.js.map