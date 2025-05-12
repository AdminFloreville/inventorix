// src/devices/printer/printer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer } from './printer.entity';
import { Inventory } from 'src/inventory/inventory.entity';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Injectable()
export class PrinterService {
  constructor(
    @InjectRepository(Printer)
    private readonly printerRepo: Repository<Printer>,

    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async findAll() {
    return this.printerRepo.find({ relations: ['inventory'] });
  }

  async findOne(id: number) {
    const printer = await this.printerRepo.findOne({
      where: { id },
      relations: ['inventory'],
    });
    if (!printer) throw new NotFoundException('Принтер не найден');
    return printer;
  }

  async create(dto: CreatePrinterDto) {
    const inventory = await this.inventoryRepo.findOneBy({ id: dto.inventoryId });
    if (!inventory) throw new NotFoundException('Инвентарь не найден');

    const printer = this.printerRepo.create({
      ...dto,
      inventory,
      isOnline: false,
    });

    return this.printerRepo.save(printer);
  }

  async update(id: number, dto: UpdatePrinterDto) {
    const printer = await this.findOne(id);

    if (dto.inventoryId) {
      const inventory = await this.inventoryRepo.findOneBy({ id: dto.inventoryId });
      if (!inventory) throw new NotFoundException('Инвентарь не найден');
      printer.inventory = inventory;
    }

    Object.assign(printer, dto);
    return this.printerRepo.save(printer);
  }

  async remove(id: number) {
    await this.printerRepo.delete(id);
  }

  async updateStatus(id: number, isOnline: boolean) {
    await this.printerRepo.update(id, { isOnline });
  }
}
