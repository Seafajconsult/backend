"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("./schemas/user.schema");
const user_service_1 = require("./services/user.service");
const referral_service_1 = require("./services/referral.service");
const referral_controller_1 = require("./controllers/referral.controller");
const notification_module_1 = require("../notification/notification.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            notification_module_1.NotificationModule,
            config_1.ConfigModule,
        ],
        providers: [user_service_1.UserService, referral_service_1.ReferralService],
        controllers: [referral_controller_1.ReferralController],
        exports: [user_service_1.UserService, referral_service_1.ReferralService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map