import {
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
import { Request } from 'express';
import { UpdateUrlDto } from './dto/update-url.dto';

interface UpdateRequest {
  req: Request;
  user: User;
  updateUrlDto: UpdateUrlDto;
  shortedUrl: string;
}

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    user: User,
    createUrlDto: CreateUrlDto,
    req: Request,
  ): Promise<UrlResponse> {
    const owner = await this.usersService.findOneById(user.id);

    const shortUrl = createUrlDto.back_half || nanoid(6);

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
      short_url: `${req.protocol}://${req.get('Host')}${req.originalUrl}/${savedUrl.short_url}`,
      expire_date: savedUrl.expire_date,
    };
  }

  async findOne(shortedUrl: string): Promise<string> {
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

  async findUrlAndValidateOwner(user: User, shortedUrl: string): Promise<Url> {
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

    if (url.user.id !== user.id) {
      throw new UnauthorizedException('You are not the owner of this url');
    }

    return url;
  }

  async updateShortLink({
    user,
    updateUrlDto,
    req,
    shortedUrl,
  }: UpdateRequest): Promise<UrlResponse> {
    const url = await this.findUrlAndValidateOwner(user, shortedUrl);

    if (updateUrlDto.original_url) {
      url.original_url = updateUrlDto.original_url;
    }
    if (updateUrlDto.back_half) {
      url.short_url = updateUrlDto.back_half;
    }

    const updatedUrl = await this.urlRepository.save(url);

    const path = req.originalUrl.split('/');

    return {
      short_url: `${req.protocol}://${req.get('Host')}/${path[1]}/${updatedUrl.short_url}`,
      expire_date: updatedUrl.expire_date,
    };
  }
}
