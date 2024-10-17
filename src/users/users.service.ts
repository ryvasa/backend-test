import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existsUser = await this.findOneByEmail(createUserDto.email);
    if (existsUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    const user: User = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);
    await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
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
