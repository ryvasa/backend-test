import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), UsersModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
