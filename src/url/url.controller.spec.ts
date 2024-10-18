import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { UpdateUrlDto } from './dto/update-url.dto';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  const mockUrlService = {
    create: jest.fn(),
    findOne: jest.fn(),
    updateShortLink: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [{ provide: UrlService, useValue: mockUrlService }],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(urlService).toBeDefined();
  });

  describe('create', () => {
    it('should create shorter link', async () => {
      const createUrlDto: CreateUrlDto = {
        original_url: 'https://example.com',
        back_half: 'short',
      };
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
      };
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 5);
      const createdUrl = {
        short_url: 'http://localhost/short',
        expire_date: expireDate,
      };
      mockUrlService.create.mockResolvedValue(createdUrl);

      const req = {
        user,
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
        originalUrl: '/',
      };
      const result = await controller.create(createUrlDto, req);

      expect(result).toEqual(createdUrl);
      expect(mockUrlService.create).toHaveBeenCalledWith(
        user,
        createUrlDto,
        req,
      );
    });
  });

  describe('findOne', () => {
    it('should find and redirect to original url', async () => {
      const short_url = 'abcdef';
      const original_url = 'https://example.com';
      mockUrlService.findOne.mockResolvedValue(original_url);

      const res = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as unknown as Response;

      await controller.findOne(short_url, res);

      expect(mockUrlService.findOne).toHaveBeenCalledWith(short_url);
      expect(res.status).toHaveBeenCalledWith(301);
      expect(res.redirect).toHaveBeenCalledWith(original_url);
    });
  });

  describe('update', () => {
    it('should update and return updated url', async () => {
      const updateUrlDto: UpdateUrlDto = {
        original_url: 'https://updated-example.com',
        back_half: 'updated-short',
      };
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
      };
      const shortedUrl = 'old-short';
      const updatedUrl = {
        short_url: 'http://localhost/updated-short',
        expire_date: new Date(),
      };

      mockUrlService.updateShortLink = jest.fn().mockResolvedValue(updatedUrl);

      const req = {
        user,
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      };

      const result = await controller.update(updateUrlDto, req, shortedUrl);

      expect(result).toEqual(updatedUrl);
      expect(mockUrlService.updateShortLink).toHaveBeenCalledWith({
        user,
        updateUrlDto,
        req,
        shortedUrl,
      });
    });

    it('should update only original_url if back_half is not provided', async () => {
      const updateUrlDto: UpdateUrlDto = {
        original_url: 'https://updated-example.com',
      };
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
      };
      const shortedUrl = 'old-short';
      const updatedUrl = {
        short_url: 'http://localhost/old-short',
        expire_date: new Date(),
      };

      mockUrlService.updateShortLink = jest.fn().mockResolvedValue(updatedUrl);

      const req = {
        user,
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      };

      const result = await controller.update(updateUrlDto, req, shortedUrl);

      expect(result).toEqual(updatedUrl);
      expect(mockUrlService.updateShortLink).toHaveBeenCalledWith({
        user,
        updateUrlDto,
        req,
        shortedUrl,
      });
    });
  });
});
