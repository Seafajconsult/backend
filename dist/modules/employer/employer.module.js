"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerModule = void 0;
const common_1 = require("@nestjs/common");
const employer_controller_1 = require("./employer.controller");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const message_module_1 = require("../message/message.module");
const application_module_1 = require("../application/application.module");
let EmployerModule = class EmployerModule {
};
exports.EmployerModule = EmployerModule;
exports.EmployerModule = EmployerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            message_module_1.MessageModule,
            application_module_1.ApplicationModule,
        ],
        controllers: [employer_controller_1.EmployerController],
        providers: [],
    })
], EmployerModule);
//# sourceMappingURL=employer.module.js.map