import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from 'src/users/entities/user.entity';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: Repository<Url>;
  let usersService: UsersService;

  const URL_REPOSITORY_TOKEN = getRepositoryToken(Url);

  const mockRepositoryUrl = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  };
  const mockUsersService = {
    findOneById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: URL_REPOSITORY_TOKEN, useValue: mockRepositoryUrl },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>(URL_REPOSITORY_TOKEN);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(urlRepository).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new url with custom_url', async () => {
      const createUrlDto: CreateUrlDto = {
        original_url: 'https://example.com',
        custom_url: 'short',
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
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 5);

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(user);
      jest.spyOn(mockRepositoryUrl, 'create').mockReturnValue({
        original_url: 'https://example.com',
        short_url: 'short',
        user: user,
        expire_date: expireDate,
      });
      jest.spyOn(mockRepositoryUrl, 'save').mockResolvedValue({
        original_url: 'https://example.com',
        short_url: 'short',
        user: user,
        expire_date: expireDate,
      });

      const result = await service.create(user, createUrlDto);

      expect(result).toEqual({
        short_url: 'short',
        expire_date: expireDate,
      });
      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(mockRepositoryUrl.create).toHaveBeenCalledWith({
        original_url: 'https://example.com',
        short_url: 'short',
        user: user,
        expire_date: expect.any(Date),
      });
      expect(mockRepositoryUrl.save).toHaveBeenCalled();
    });

    it('should create a new url without custom_url', async () => {
      const createUrlDto: CreateUrlDto = {
        original_url: 'https://example.com',
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

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(user);
      jest.spyOn(mockRepositoryUrl, 'create').mockReturnValue({
        original_url: 'https://example.com',
        short_url: expect.any(String),
        user: user,
        expire_date: expect.any(Date),
      });
      jest.spyOn(mockRepositoryUrl, 'save').mockResolvedValue({
        original_url: 'https://example.com',
        short_url: expect.any(String),
        user: user,
        expire_date: expect.any(Date),
      });

      const result = await service.create(user, createUrlDto);

      expect(result).toEqual({
        short_url: expect.any(String),
        expire_date: expect.any(Date),
      });
      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(mockRepositoryUrl.create).toHaveBeenCalled();
      expect(mockRepositoryUrl.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return url', async () => {
      const user: User = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
        created_date: new Date(),
        updated_date: new Date(),
        urls: [],
      };
      const url: Url = {
        id: '1',
        original_url: 'https://example.com',
        short_url: 'short',
        user: user,
        created_date: new Date(),
        expire_date: new Date(),
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(url),
      };

      jest
        .spyOn(mockRepositoryUrl, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(user, 'short');
      expect(result).toEqual(url.original_url);
      expect(mockRepositoryUrl.createQueryBuilder).toHaveBeenCalledWith('url');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'url.user',
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'url.short_url = :shortedUrl',
        { shortedUrl: 'short' },
      );
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
    it('should return error if url not found', async () => {
      const user: User = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
        created_date: new Date(),
        updated_date: new Date(),
        urls: [],
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(mockRepositoryUrl, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await expect(service.findOne(user, 'short')).rejects.toThrow(
        `Url not found`,
      );
      expect(mockRepositoryUrl.createQueryBuilder).toHaveBeenCalledWith('url');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'url.user',
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'url.short_url = :shortedUrl',
        { shortedUrl: 'short' },
      );
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
  });
});
