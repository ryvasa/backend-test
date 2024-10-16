import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserWithToken } from './interfaces/user-token.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(loginAuthDto: LoginAuthDto): Promise<Omit<User, 'password'> | null>;
    login(user: User): Promise<UserWithToken>;
}
