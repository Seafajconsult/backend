"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const student_controller_1 = require("./student.controller");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const document_module_1 = require("../document/document.module");
const payment_module_1 = require("../payment/payment.module");
const message_module_1 = require("../message/message.module");
const notification_module_1 = require("../notification/notification.module");
const application_module_1 = require("../application/application.module");
const student_profile_schema_1 = require("./schemas/student-profile.schema");
const testimonial_schema_1 = require("./schemas/testimonial.schema");
const student_profile_service_1 = require("./services/student-profile.service");
const testimonial_service_1 = require("./services/testimonial.service");
const student_profile_controller_1 = require("./controllers/student-profile.controller");
const testimonial_controller_1 = require("./controllers/testimonial.controller");
let StudentModule = class StudentModule {
};
exports.StudentModule = StudentModule;
exports.StudentModule = StudentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: student_profile_schema_1.StudentProfile.name, schema: student_profile_schema_1.StudentProfileSchema },
                { name: testimonial_schema_1.Testimonial.name, schema: testimonial_schema_1.TestimonialSchema }
            ]),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            document_module_1.DocumentModule,
            payment_module_1.PaymentModule,
            message_module_1.MessageModule,
            notification_module_1.NotificationModule,
            application_module_1.ApplicationModule,
        ],
        controllers: [student_controller_1.StudentController, student_profile_controller_1.StudentProfileController, testimonial_controller_1.TestimonialController],
        providers: [student_profile_service_1.StudentProfileService, testimonial_service_1.TestimonialService],
        exports: [student_profile_service_1.StudentProfileService, testimonial_service_1.TestimonialService]
    })
], StudentModule);
//# sourceMappingURL=student.module.js.map