import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryPart } from './inventory-part.entity';
import { Inventory } from './inventory.entity';
import { CreateInventoryPartDto } from './dto/create-inventory-part.dto';
import { UpdateInventoryPartDto } from './dto/update-inventory-part.dto';

@Injectable()
export class InventoryPartService {
  constructor(
    @InjectRepository(InventoryPart)
    private partRepo: Repository<InventoryPart>,

    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
  ) {}

  async findAllByInventory(inventoryId: number): Promise<InventoryPart[]> {
    return this.partRepo.find({ where: { inventory: { id: inventoryId } } });
  }

  async create(
    inventoryId: number,
    dto: CreateInventoryPartDto,
  ): Promise<InventoryPart> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id: inventoryId },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    const part = this.partRepo.create({ ...dto, inventory });
    return this.partRepo.save(part);
  }

  async update(
    partId: number,
    dto: UpdateInventoryPartDto,
  ): Promise<InventoryPart> {
    const part = await this.partRepo.findOne({ where: { id: partId } });
    if (!part) throw new NotFoundException('Part not found');

    Object.assign(part, dto);
    return this.partRepo.save(part);
  }

  async remove(partId: number): Promise<void> {
    await this.partRepo.delete(partId);
  }
}
