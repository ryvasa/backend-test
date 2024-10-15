import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UrlModule } from './url/url.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsTableName: 'custom_migration_table',
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    UrlModule,
    DatabaseModule,
  ],
})
export class AppModule {}
