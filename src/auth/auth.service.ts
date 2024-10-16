import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserWithToken } from './interfaces/user-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    loginAuthDto: LoginAuthDto,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(loginAuthDto.email);
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<UserWithToken> {
    const accessToken = await this.jwtService.signAsync(
      { id: user.id },
      { secret: process.env.JWT_SECRET },
    );
    return { ...user, accessToken };
  }
}
