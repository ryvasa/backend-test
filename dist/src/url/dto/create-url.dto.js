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
exports.CreateUrlDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUrlDto {
}
exports.CreateUrlDto = CreateUrlDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'https://google.com/aswqe_wqw32_q3rw=2',
    }),
    (0, class_validator_1.IsUrl)({}),
    __metadata("design:type", String)
], CreateUrlDto.prototype, "original_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'google123',
        maxLength: 16,
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(16, { message: 'Custom URL must not exceed 16 characters' }),
    __metadata("design:type", String)
], CreateUrlDto.prototype, "custom_url", void 0);
//# sourceMappingURL=create-url.dto.js.map