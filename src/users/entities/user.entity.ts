import { Url } from '../../url/entities/url.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  name: string;

  @Column({ unique: true, nullable: false, length: 255, type: 'varchar' })
  email: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  password: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];
}
