import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from '../schemas/testimonial.schema';
import { CreateTestimonialDto } from '../dto/testimonial.dto';
import { TestimonialStatus } from '../enums/testimonial-status.enum';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<Testimonial>,
  ) {}

  async create(userId: string, createTestimonialDto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.create({
      ...createTestimonialDto,
      userId,
      status: TestimonialStatus.PENDING
    });
    return testimonial;
  }

  async findAll({ page = 1, limit = 10, status }: { page: number; limit: number; status?: TestimonialStatus }) {
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

  async findByUserId(userId: string): Promise<Testimonial[]> {
    return this.testimonialModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findById(id);
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }
    return testimonial;
  }

  async updateStatus(id: string, status: TestimonialStatus, rejectionReason?: string): Promise<Testimonial> {
    const testimonial = await this.findById(id);
    
    testimonial.status = status;
    if (status === TestimonialStatus.REJECTED && rejectionReason) {
      testimonial.rejectionReason = rejectionReason;
    }

    return testimonial.save();
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const testimonial = await this.findById(id);
    
    if (testimonial.userId.toString() !== userId) {
      throw new BadRequestException('You can only delete your own testimonials');
    }

    await this.testimonialModel.findByIdAndDelete(id);
    return true;
  }
}
