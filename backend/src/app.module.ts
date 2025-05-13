// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/user.entity';
import { History } from './history/history.entity';
import { Inventory } from './inventory/inventory.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { CameraModule } from './devices/camera/camera.module';
import { HistoryModule } from './history/history.module';
import { InventorySubscriber } from './history/inventory.subscriber';
import { ScheduleModule } from '@nestjs/schedule';
import { PrinterModule } from './devices/printer/printer.module';
import { Printer } from './devices/printer/printer.entity';
import { InventoryPart } from './inventory/inventory-part.entity';
import { Role } from './roles/role.entity';
import { RoleModule } from './roles/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Printer, Inventory]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Inventory, History, InventoryPart, Role],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    InventoryModule,
    CameraModule,
    HistoryModule,
    PrinterModule,
    RoleModule
  ],
  providers: [InventorySubscriber], // 🔥 обязательно здесь!
})
export class AppModule {}
