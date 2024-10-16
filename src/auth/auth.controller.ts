import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'User is logged in successfully.',
  })
  @ApiBody({ type: LoginAuthDto })
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req: any): Promise<User> {
    return this.authService.login(req.user);
  }
}
