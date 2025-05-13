// src/users/users.controller.ts
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles('admin')
  async create(@Body() dto: { email: string; password: string; name?: string; roles?: string[]; isActive?: boolean }) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name || '',
      isActive: dto.isActive ?? true,
    });

    if (dto.roles?.length) {
      await this.usersService.assignRoles(user.id, dto.roles);
    }

    return user;
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: number,
    @Body() dto: Partial<{ name: string; email: string; isActive: boolean }>
  ) {
    return this.usersService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/roles')
  @Roles('admin')
  assignRoles(@Param('id') id: number, @Body() dto: { roles: string[] }) {
    return this.usersService.assignRoles(+id, dto.roles);
  }

  @Get('admin-only')
  @Roles('admin')
  getAdminStuff() {
    return { message: 'Only for admins!' };
  }

  @Get('any-authenticated')
  getUserStuff() {
    return { message: 'Any authenticated user can see this' };
  }
}
