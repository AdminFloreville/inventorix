// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];



  @CreateDateColumn()
  createdAt: Date;
}
