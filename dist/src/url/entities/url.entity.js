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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Url = class Url {
    setExpireDate() {
        const creationDate = new Date();
        this.expire_date = new Date(creationDate.setFullYear(creationDate.getFullYear() + 5));
    }
};
exports.Url = Url;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Url.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, length: 2048, type: 'varchar' }),
    __metadata("design:type", String)
], Url.prototype, "original_url", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ unique: true, nullable: false, length: 16, type: 'varchar' }),
    __metadata("design:type", String)
], Url.prototype, "short_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Url.prototype, "created_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Url.prototype, "expire_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.urls),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Url.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Url.prototype, "setExpireDate", null);
exports.Url = Url = __decorate([
    (0, typeorm_1.Entity)()
], Url);
//# sourceMappingURL=url.entity.js.map