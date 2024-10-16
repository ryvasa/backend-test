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
exports.UrlController = void 0;
const common_1 = require("@nestjs/common");
const url_service_1 = require("./url.service");
const create_url_dto_1 = require("./dto/create-url.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UrlController = class UrlController {
    constructor(urlService) {
        this.urlService = urlService;
    }
    async create(createUrlDto, req) {
        return this.urlService.create(req.user, createUrlDto);
    }
    async findOne(short_url, req, res) {
        const url = await this.urlService.findOne(req, short_url);
        return res.status(301).redirect(url);
    }
};
exports.UrlController = UrlController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a shorted url' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Url is created successfully.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JWTAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_url_dto_1.CreateUrlDto, Object]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find a shorted url' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Url is found successfully.' }),
    (0, common_1.Get)(':short_url'),
    __param(0, (0, common_1.Param)('short_url')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "findOne", null);
exports.UrlController = UrlController = __decorate([
    (0, swagger_1.ApiTags)('Url'),
    (0, common_1.Controller)('url'),
    __metadata("design:paramtypes", [url_service_1.UrlService])
], UrlController);
//# sourceMappingURL=url.controller.js.map