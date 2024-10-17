import { User } from 'src/users/entities/user.entity';

export interface UserWithToken extends User {
  accessToken: string;
}
