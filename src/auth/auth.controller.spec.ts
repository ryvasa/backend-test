import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserWithToken } from 'src/users/interfaces/user-token.interface';
import { User } from 'src/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return user with access token', async () => {
      const user: User = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed-password',
        created_date: new Date(),
        updated_date: new Date(),
        urls: [],
      };

      const userWithToken: UserWithToken = {
        ...user,
        accessToken: 'mock-access-token',
      };

      mockAuthService.login.mockResolvedValue(userWithToken);

      const req = { user };
      const result = await controller.login(req);

      expect(result).toEqual(userWithToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });
});
