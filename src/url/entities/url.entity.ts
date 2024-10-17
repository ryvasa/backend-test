import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 2048, type: 'varchar' })
  original_url: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false, length: 16, type: 'varchar' })
  short_url: string;

  @CreateDateColumn()
  created_date: Date;

  @Column({ type: 'datetime', nullable: false })
  expire_date: Date;

  @ManyToOne(() => User, (user) => user.urls)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
