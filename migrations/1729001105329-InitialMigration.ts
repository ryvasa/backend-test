import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1729001105329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `users`');
  }
}
