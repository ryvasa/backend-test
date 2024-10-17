import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
  });
  describe('create', () => {
    it('should create user', async () => {
      const userDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      };
      const createdUser: User = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
        created_date: new Date(),
        updated_date: new Date(),
        urls: [],
      };

      mockUsersService.create.mockResolvedValue(createdUser);
      const user = await controller.create(userDto);

      expect(user).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(userDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'John',
          email: 'john@example.com',
          password: 'hashed-password',
          created_date: new Date(),
          updated_date: new Date(),
          urls: [],
        },
      ];

      mockUsersService.findAll.mockResolvedValue(users);
      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });
});
