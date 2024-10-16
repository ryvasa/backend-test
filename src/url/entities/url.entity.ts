import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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

  @Column({ type: 'datetime', nullable: true })
  expire_date?: Date;

  @ManyToOne(() => User, (user) => user.urls)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  setExpireDate() {
    const creationDate = new Date();
    this.expire_date = new Date(
      creationDate.setFullYear(creationDate.getFullYear() + 5),
    );
  }
}
