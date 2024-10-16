"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const typeorm_filter_1 = require("./filters/typeorm.filter");
const common_1 = require("@nestjs/common");
const global_interceptors_1 = require("./interceptors/global.interceptors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('URL Shortener API')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Input your JWT token',
        name: 'Authorization',
        in: 'header',
    }, 'bearer')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            security: [{ bearer: [] }],
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new typeorm_filter_1.TypeOrmFilter());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new global_interceptors_1.GlobalInterceptors());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map