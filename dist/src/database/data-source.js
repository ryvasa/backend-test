"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
const options = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    migrationsTableName: 'custom_migration_table',
    synchronize: false,
};
const AppDataSource = new typeorm_1.DataSource(options);
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map