// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { HistoryModule } from 'src/history/history.module';
import { InventoryPart } from './inventory-part.entity';
import { InventoryPartController } from './inventory-part.controller';
import { InventoryPartService } from './inventory-part.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryPart]),
    HistoryModule,
  ],
  providers: [InventoryService, InventoryPartService],
  controllers: [InventoryController, InventoryPartController],
})
export class InventoryModule {}
