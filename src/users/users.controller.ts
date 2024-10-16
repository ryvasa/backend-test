import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'User is created successfully.',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({
    status: 200,
    description: 'Users are found successfully.',
  })
  @UseInterceptors(CacheInterceptor)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // @Get(':email')
  // async findOne(@Param('email') email: string): Promise<User> {
  //   return this.usersService.findOne(email);
  // }
}
