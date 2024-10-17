import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('should return user with token', async () => {
      const user: User = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
        created_date: new Date(),
        updated_date: new Date(),
        urls: [],
      };
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('test');
      const result = await service.login(user);

      expect(result).toEqual({ ...user, accessToken: 'test' });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: user.id },
        {
          secret: process.env.JWT_SECRET,
        },
      );
    });
  });

  describe('validateUser', () => {
    it('should return error if user not found', async () => {
      const loginAuthDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'password',
      };
      jest
        .spyOn(mockUsersService, 'findOneByEmail')
        .mockRejectedValue(
          new NotFoundException(
            `User with email ${loginAuthDto.email} not found`,
          ),
        );

      expect(service.validateUser(loginAuthDto)).rejects.toThrow(
        `User with email ${loginAuthDto.email} not found`,
      );
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        loginAuthDto.email,
      );
    });

    it('should return null if user found but password not match', async () => {
      const loginAuthDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'password',
      };
      const user = {
        id: '1',
        email: 'john@example.com',
        password: 'hashed-password',
        name: 'John',
      };
      jest.spyOn(mockUsersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
      const result = await service.validateUser(loginAuthDto);

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginAuthDto.password,
        user.password,
      );
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        loginAuthDto.email,
      );
    });

    it('should return user if credentials are valid', async () => {
      const loginAuthDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'password',
      };
      const user = {
        id: '1',
        email: 'john@example.com',
        password: 'hashed-password',
        name: 'John',
      };
      jest.spyOn(mockUsersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      const result = await service.validateUser(loginAuthDto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        loginAuthDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginAuthDto.password,
        user.password,
      );
      expect(result).toEqual({
        id: '1',
        email: 'john@example.com',
        name: 'John',
      });
    });
  });
});
