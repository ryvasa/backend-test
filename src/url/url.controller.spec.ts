import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  const mockUrlService = {
    create: jest.fn(),
    findOne: jest.fn(),
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
        custom_url: 'short',
      };
      const user = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
      };
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 5);
      const createdUrl = {
        short_url: 'short',
        expire_date: expireDate,
      };
      mockUrlService.create.mockResolvedValue(createdUrl);

      const req = { user };
      const result = await controller.create(createUrlDto, req);

      expect(result).toEqual(createdUrl);
      expect(mockUrlService.create).toHaveBeenCalledWith(user, createUrlDto);
    });
  });

  describe('findOne', () => {
    it('should find and redirect to original url', async () => {
      const short_url = 'abcdef';
      const original_url = 'https://example.com';
      mockUrlService.findOne.mockResolvedValue(original_url);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as unknown as Response;

      await controller.findOne(short_url, req, res);

      expect(mockUrlService.findOne).toHaveBeenCalledWith(req, short_url);
      expect(res.status).toHaveBeenCalledWith(301);
      expect(res.redirect).toHaveBeenCalledWith(original_url);
    });
  });
});
