// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
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
