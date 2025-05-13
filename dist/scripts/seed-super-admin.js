"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const user_service_1 = require("../modules/user/user.service");
const user_schema_1 = require("../modules/user/user.schema");
const bcrypt = require("bcryptjs");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userService = app.get(user_service_1.UserService);
    try {
        const existingSuperAdmin = await userService.findByRole(user_schema_1.UserRole.SUPER_ADMIN);
        if (existingSuperAdmin && existingSuperAdmin.length > 0) {
            console.log('Super admin already exists');
        }
        else {
            const password = 'SuperAdmin@123';
            const hashedPassword = await bcrypt.hash(password, 12);
            const superAdmin = await userService.create({
                email: 'super.admin@sea-faj.com',
                password: hashedPassword,
                userId: await userService.generateUniqueUserId(),
                role: user_schema_1.UserRole.SUPER_ADMIN,
                isEmailVerified: true,
            });
            console.log('Super admin created successfully:', superAdmin.email);
            console.log('Please change the default password after first login');
        }
    }
    catch (error) {
        console.error('Error seeding super admin:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed-super-admin.js.map