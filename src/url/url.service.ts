import { Injectable, NotFoundException } from '@nestjs/common';
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

    const generateExpirationDate = (): Date => {
      const creationDate = new Date();

      return new Date(creationDate.setFullYear(creationDate.getFullYear() + 5));
    };

    const data = {
      original_url: createUrlDto.original_url,
      short_url: shortUrl,
      user: owner,
      expire_date: generateExpirationDate(),
    };
    const url = this.urlRepository.create(data);
    const savedUrl = await this.urlRepository.save(url);
    return {
      short_url: savedUrl.short_url,
      expire_date: savedUrl.expire_date,
    };
  }

  async findOne(user: User, shortedUrl: string): Promise<string> {
    const url = await this.urlRepository
      .createQueryBuilder('url')
      .leftJoinAndSelect('url.user', 'user')
      .where('url.short_url = :shortedUrl', {
        shortedUrl,
      })
      .getOne();
    if (!url) {
      throw new NotFoundException('Url not found');
    }
    return url.original_url;
  }

  // async validateOwner({ shortedUrl }): Promise<Url> {
  //   const result = await this.urlRepository
  //     .createQueryBuilder('url')
  //     .leftJoinAndSelect('url.user', 'user')
  //     .where('url.short_url = :shortedUrl', {
  //       shortedUrl,
  //     })
  //     .getOne();
  //   if (!result) {
  //     throw new NotFoundException('Url not found');
  //   }
  //   // if (result.user.id !== userId) {
  //   //   throw new UnauthorizedException('You are not the owner of this url');
  //   // }
  //   return result;
  // }
}
