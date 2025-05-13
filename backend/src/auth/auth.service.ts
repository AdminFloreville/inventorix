// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const fullUser = await this.usersService.findByEmail(user.email);
    if (!fullUser) {
      throw new UnauthorizedException('Пользователь не найден');
    }
  
    const payload = {
      email: fullUser.email,
      sub: fullUser.id,
      roles: fullUser.roles?.map((r) => r.name) || [], // безопасно
    };
  
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    // Проверяем, сколько пользователей уже есть
    const existingUsers = await this.usersService.count();
    console.log(existingUsers);
    
    // Создаём пользователя
    const user = await this.usersService.create({ email, password: hashed });

    // Если это первый пользователь — назначаем роль "admin"
    if (existingUsers === 0) {
      await this.usersService.assignRoles(user.id, ['admin']);
    }

    return user;
  }
}
