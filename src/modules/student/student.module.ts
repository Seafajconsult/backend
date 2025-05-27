import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { DocumentModule } from '../document/document.module';
import { PaymentModule } from '../payment/payment.module';
import { MessageModule } from '../message/message.module';
import { NotificationModule } from '../notification/notification.module';
import { ApplicationModule } from '../application/application.module';
import { StudentProfile, StudentProfileSchema } from './schemas/student-profile.schema';
import { Testimonial, TestimonialSchema } from './schemas/testimonial.schema';
import { StudentProfileService } from './services/student-profile.service';
import { TestimonialService } from './services/testimonial.service';
import { StudentProfileController } from './controllers/student-profile.controller';
import { TestimonialController } from './controllers/testimonial.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: Testimonial.name, schema: TestimonialSchema }
    ]),
    AuthModule,
    UserModule,
    DocumentModule,
    PaymentModule,
    MessageModule,
    NotificationModule,
    ApplicationModule,
  ],
  controllers: [StudentController, StudentProfileController, TestimonialController],
  providers: [StudentProfileService, TestimonialService],
  exports: [StudentProfileService, TestimonialService]
})
export class StudentModule {}
