"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const url_entity_1 = require("./entities/url.entity");
const users_service_1 = require("../users/users.service");
const nanoid_1 = require("nanoid");
let UrlService = class UrlService {
    constructor(urlRepository, usersService) {
        this.urlRepository = urlRepository;
        this.usersService = usersService;
    }
    async create(user, createUrlDto) {
        const owner = await this.usersService.findOneById(user.id);
        const shortUrl = createUrlDto.custom_url || (0, nanoid_1.nanoid)(6);
        const data = {
            original_url: createUrlDto.original_url,
            short_url: shortUrl,
            user: owner,
        };
        const url = this.urlRepository.create(data);
        const savedUrl = await this.urlRepository.save(url);
        return {
            short_url: savedUrl.short_url,
            expire_date: savedUrl.expire_date,
        };
    }
    async findOne(user, shortedUrl) {
        const url = await this.validateOwner({ shortedUrl });
        if (url.expire_date < new Date()) {
            throw new common_1.BadRequestException('Url is expired');
        }
        return url.original_url;
    }
    async validateOwner({ shortedUrl }) {
        const result = await this.urlRepository
            .createQueryBuilder('url')
            .leftJoinAndSelect('url.user', 'user')
            .where('url.short_url = :shortedUrl', {
            shortedUrl,
        })
            .getOne();
        if (!result) {
            throw new common_1.NotFoundException('Url not found');
        }
        return result;
    }
};
exports.UrlService = UrlService;
exports.UrlService = UrlService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(url_entity_1.Url)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], UrlService);
//# sourceMappingURL=url.service.js.map