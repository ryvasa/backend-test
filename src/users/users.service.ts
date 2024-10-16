import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with id ${email} not found`);
    }
    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
