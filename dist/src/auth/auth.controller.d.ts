import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<User>;
}
