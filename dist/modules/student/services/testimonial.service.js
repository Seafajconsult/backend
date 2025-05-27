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
exports.TestimonialService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const testimonial_schema_1 = require("../schemas/testimonial.schema");
const testimonial_status_enum_1 = require("../enums/testimonial-status.enum");
let TestimonialService = class TestimonialService {
    constructor(testimonialModel) {
        this.testimonialModel = testimonialModel;
    }
    async create(userId, createTestimonialDto) {
        const testimonial = await this.testimonialModel.create({
            ...createTestimonialDto,
            userId,
            status: testimonial_status_enum_1.TestimonialStatus.PENDING
        });
        return testimonial;
    }
    async findAll({ page = 1, limit = 10, status }) {
        const skip = (page - 1) * limit;
        const filter = status ? { status } : {};
        const [testimonials, total] = await Promise.all([
            this.testimonialModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'firstName lastName email')
                .exec(),
            this.testimonialModel.countDocuments(filter),
        ]);
        return {
            testimonials,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findByUserId(userId) {
        return this.testimonialModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const testimonial = await this.testimonialModel.findById(id);
        if (!testimonial) {
            throw new common_1.NotFoundException('Testimonial not found');
        }
        return testimonial;
    }
    async updateStatus(id, status, rejectionReason) {
        const testimonial = await this.findById(id);
        testimonial.status = status;
        if (status === testimonial_status_enum_1.TestimonialStatus.REJECTED && rejectionReason) {
            testimonial.rejectionReason = rejectionReason;
        }
        return testimonial.save();
    }
    async delete(userId, id) {
        const testimonial = await this.findById(id);
        if (testimonial.userId.toString() !== userId) {
            throw new common_1.BadRequestException('You can only delete your own testimonials');
        }
        await this.testimonialModel.findByIdAndDelete(id);
        return true;
    }
};
exports.TestimonialService = TestimonialService;
exports.TestimonialService = TestimonialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(testimonial_schema_1.Testimonial.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TestimonialService);
//# sourceMappingURL=testimonial.service.js.map