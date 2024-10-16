import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { nanoid } from 'nanoid';
import { UrlResponse } from './interfaces/url-response.interface';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly usersService: UsersService,
  ) {}

  async create(user: User, createUrlDto: CreateUrlDto): Promise<UrlResponse> {
    const owner = await this.usersService.findOneById(user.id);

    const shortUrl = createUrlDto.custom_url || nanoid(6);
    const data = {
      original_url: createUrlDto.original_url,
      short_url: shortUrl,
      user: owner,
    };
    const url = this.urlRepository.create(data);
    const savedUrl = await this.urlRepository.save(url);
    return {
      short_url: savedUrl.short_url,
      expire_date: savedUrl.expire_date,
    };
  }

  async findOne(user: User, shortedUrl: string): Promise<string> {
    const url = await this.validateOwner({ shortedUrl });
    if (url.expire_date < new Date()) {
      throw new BadRequestException('Url is expired');
    }
    return url.original_url;
  }

  async validateOwner({ shortedUrl }): Promise<Url> {
    const result = await this.urlRepository
      .createQueryBuilder('url')
      .leftJoinAndSelect('url.user', 'user')
      .where('url.short_url = :shortedUrl', {
        shortedUrl,
      })
      .getOne();
    if (!result) {
      throw new NotFoundException('Url not found');
    }
    // if (result.user.id !== userId) {
    //   throw new UnauthorizedException('You are not the owner of this url');
    // }
    return result;
  }
}
