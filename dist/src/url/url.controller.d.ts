import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { UrlResponse } from './interfaces/url-response.interface';
export declare class UrlController {
    private readonly urlService;
    constructor(urlService: UrlService);
    create(createUrlDto: CreateUrlDto, req: any): Promise<UrlResponse>;
    findOne(short_url: string, req: any, res: Response): Promise<void>;
}
