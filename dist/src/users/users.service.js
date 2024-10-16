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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const cache_service_1 = require("../cache/cache.service");
let UsersService = class UsersService {
    constructor(userRepository, cacheService) {
        this.userRepository = userRepository;
        this.cacheService = cacheService;
    }
    async create(createUserDto) {
        const user = this.userRepository.create(createUserDto);
        user.password = await bcrypt.hash(createUserDto.password, 10);
        return await this.userRepository.save(user);
    }
    async findAll() {
        return await this.userRepository.find({
            select: ['id', 'name', 'email'],
        });
    }
    async findOneByEmail(email) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${email} not found`);
        }
        return user;
    }
    async findOneById(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cache_service_1.CacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map