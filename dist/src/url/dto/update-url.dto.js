"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUrlDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_url_dto_1 = require("./create-url.dto");
class UpdateUrlDto extends (0, swagger_1.PartialType)(create_url_dto_1.CreateUrlDto) {
}
exports.UpdateUrlDto = UpdateUrlDto;
//# sourceMappingURL=update-url.dto.js.map