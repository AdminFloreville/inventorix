// src/inventory/inventory.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Repository } from 'typeorm';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    private readonly historyService: HistoryService,
  ) {}

  async findAll(): Promise<Inventory[]> {
    const inventories = await this.inventoryRepo.find({ relations: ['parts'] });
    return inventories.map((inv) => ({
      ...inv,
      count: inv.parts?.length || 0, // динамически устанавливаем count
    }));
  }

  async findOne(id: number): Promise<Inventory | null> {
    const inv = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['parts'],
    });

    if (!inv) return null;

    return {
      ...inv,
      count: inv.parts?.length || 0,
    };
  }

  async create(data: Partial<Inventory>): Promise<Inventory> {
    const item = this.inventoryRepo.create(data);
    const saved = await this.inventoryRepo.save(item);
    await this.historyService.logChange('create', 'inventory', saved.id, saved);
    return saved;
  }

  async update(
    id: number,
    data: Partial<Inventory>,
  ): Promise<Inventory | null> {
    await this.inventoryRepo.update(id, data);
    const updated = await this.findOne(id);
    if (updated) {
      await this.historyService.logChange(
        'update',
        'inventory',
        updated.id,
        updated,
      );
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const toDelete = await this.findOne(id);
    if (toDelete) {
      await this.inventoryRepo.delete(id);
      await this.historyService.logChange('delete', 'inventory', id, toDelete);
    }
  }
}
