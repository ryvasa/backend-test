import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const mockRepositoryUser = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockRepositoryUser,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      };
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashed-password');
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
      };
      mockRepositoryUser.create.mockReturnValue(user);
      mockRepositoryUser.save.mockResolvedValue(user);
      const result = await service.create(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...data } = user;
      expect(result).toEqual(data);
      expect(service.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockRepositoryUser.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepositoryUser.save).toHaveBeenCalledWith(user);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    });
    it('should throw error if user already exsist', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      };
      const user: User = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
        created_date: new Date(),
        updated_date: new Date(),
        urls: [],
      };
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(user);
      await expect(service.create(createUserDto)).rejects.toThrow(
        `User with email ${createUserDto.email} already exists`,
      );
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
        {
          id: '2',
          name: 'Jane',
          email: 'jane@example.com',
          password: 'hashed-password',
          created_date: new Date(),
          updated_date: new Date(),
          urls: [],
        },
      ];
      mockRepositoryUser.find.mockResolvedValue(users);
      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepositoryUser.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'email'],
      });
      expect(mockRepositoryUser.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByEmail', () => {
    const user: User = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashed-password',
      created_date: new Date(),
      updated_date: new Date(),
      urls: [],
    };
    it('should return one user', async () => {
      mockRepositoryUser.findOneBy.mockResolvedValue(user);
      const result = await service.findOneByEmail('john@example.com');

      expect(result).toEqual(user);
      expect(mockRepositoryUser.findOneBy).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
    });

    it('should throw an error if user not found', async () => {
      mockRepositoryUser.findOneBy.mockResolvedValue(null);
      await expect(service.findOneByEmail(user.email)).rejects.toThrow(
        `User with email ${user.email} not found`,
      );
    });
  });

  describe('findOneById', () => {
    const user: User = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashed-password',
      created_date: new Date(),
      updated_date: new Date(),
      urls: [],
    };
    it('should return one user', async () => {
      mockRepositoryUser.findOneBy.mockResolvedValue(user);
      const result = await service.findOneById('1');
      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      mockRepositoryUser.findOneBy.mockResolvedValue(null);
      await expect(service.findOneById(user.id)).rejects.toThrow(
        `User with id ${user.id} not found`,
      );
    });
  });
});
