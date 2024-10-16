import { Url } from 'src/url/entities/url.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    created_date: Date;
    updated_date: Date;
    urls: Url[];
}
