"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1729001105329 = void 0;
class InitialMigration1729001105329 {
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE `users`');
    }
}
exports.InitialMigration1729001105329 = InitialMigration1729001105329;
//# sourceMappingURL=1729001105329-InitialMigration.js.map