"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const url_module_1 = require("./url/url.module");
const database_module_1 = require("./database/database.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 20,
                },
            ]),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 30,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/../migrations/*{.ts,.js}'],
                migrationsTableName: 'custom_migration_table',
                synchronize: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            url_module_1.UrlModule,
            database_module_1.DatabaseModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map