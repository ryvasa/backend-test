import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CacheService } from 'src/cache/cache.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly cacheService;
    constructor(userRepository: Repository<User>, cacheService: CacheService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(id: string): Promise<User>;
}
