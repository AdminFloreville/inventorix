// src/roles/role.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.roleService.create(name);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body('name') name: string) {
    return this.roleService.update(+id, name);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove(+id);
  }
}
