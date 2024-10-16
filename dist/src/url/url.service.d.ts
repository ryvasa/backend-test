import { CreateUrlDto } from './dto/create-url.dto';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UrlResponse } from './interfaces/url-response.interface';
export declare class UrlService {
    private readonly urlRepository;
    private readonly usersService;
    constructor(urlRepository: Repository<Url>, usersService: UsersService);
    create(user: User, createUrlDto: CreateUrlDto): Promise<UrlResponse>;
    findOne(user: User, shortedUrl: string): Promise<string>;
    validateOwner({ shortedUrl }: {
        shortedUrl: any;
    }): Promise<Url>;
}
