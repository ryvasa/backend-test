import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
export declare class UrlController {
    private readonly urlService;
    constructor(urlService: UrlService);
    create(createUrlDto: CreateUrlDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUrlDto: UpdateUrlDto): string;
    remove(id: string): string;
}
