import { User } from 'src/users/entities/user.entity';
export declare class Url {
    id: string;
    original_url: string;
    short_url: string;
    created_date: Date;
    expire_date?: Date;
    user: User;
    setExpireDate(): void;
}
