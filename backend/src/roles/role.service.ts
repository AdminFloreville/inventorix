// src/roles/role.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  findAll() {
    return this.roleRepo.find();
  }

  create(name: string) {
    const role = this.roleRepo.create({ name });
    return this.roleRepo.save(role);
  }

  async update(id: number, name: string) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Роль не найдена');
    role.name = name;
    return this.roleRepo.save(role);
  }

  async remove(id: number) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Роль не найдена');
    return this.roleRepo.remove(role);
  }
}
