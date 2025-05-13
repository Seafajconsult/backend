"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const express_rate_limit_1 = require("express-rate-limit");
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
async function bootstrap() {
    console.log('PORT from process.env:', process.env.PORT);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    console.log('PORT from ConfigService:', configService.get('app.port'));
    app.use((0, helmet_1.default)());
    app.use((0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.enableCors({
        origin: configService.get("app.frontendUrl"),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const apiPrefix = configService.get("app.apiPrefix");
    app.setGlobalPrefix(apiPrefix);
    try {
        (0, swagger_1.setupSwagger)(app, apiPrefix);
    }
    catch (error) {
        console.error('Error setting up Swagger:', error);
    }
    const port = process.env.PORT || 5001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map