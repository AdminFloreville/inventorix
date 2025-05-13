// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['roles'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async assignRoles(userId: number, roleNames: string[]): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User not found');

    const roles = await this.roleRepo.findBy({ name: In(roleNames) });
    user.roles = roles;

    return this.userRepo.save(user);
  }

  async count(): Promise<number> {
    return this.userRepo.count();
  }


async update(id: number, data: Partial<User>): Promise<User> {
  const user = await this.userRepo.findOneBy({ id });
  if (!user) throw new NotFoundException('User not found');
  Object.assign(user, data);
  return this.userRepo.save(user);
}

async remove(id: number): Promise<void> {
  const user = await this.userRepo.findOneBy({ id });
  if (!user) throw new NotFoundException('User not found');
  await this.userRepo.remove(user);
}

}
