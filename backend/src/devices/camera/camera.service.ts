import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';
import { Inventory } from 'src/inventory/inventory.entity';
import { CameraGateway } from './camera.gateway';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera)
    private readonly cameraRepo: Repository<Camera>,

    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    private readonly gateway: CameraGateway,
  ) {}

  async findAll() {
    return this.cameraRepo.find({ relations: ['inventory'] });
  }

  async findOne(id: number): Promise<Camera | null> {
    return this.cameraRepo.findOne({ where: { id }, relations: ['inventory'] });
  }

  async create(dto: CreateCameraDto): Promise<Camera> {
    const inventory = await this.inventoryRepo.findOneBy({ id: dto.inventoryId });
    if (!inventory) throw new NotFoundException('Инвентарь не найден');
  
    const camera = this.cameraRepo.create({
      ipAddress: dto.ipAddress,
      inventory,
      isOnline: false,
      offlineSince: new Date(),
    });
  
    return this.cameraRepo.save(camera);
  }

  async paginatedSearch(search = '', limit = 10, offset = 0) {
    const query = this.cameraRepo
      .createQueryBuilder('camera')
      .leftJoinAndSelect('camera.inventory', 'inventory')
      .orderBy('camera.id', 'DESC')
      .take(limit)
      .skip(offset);
  
    if (search) {
      query.andWhere(
        `(camera.ipAddress ILIKE :search OR camera.name ILIKE :search OR camera.description ILIKE :search OR camera.location ILIKE :search OR inventory.name ILIKE :search)`,
        { search: `%${search}%` },
      );
    }
  
    const [items, total] = await query.getManyAndCount();
  
    return {
      items,
      total,
      hasMore: offset + items.length < total,
    };
  }
  
  async update(id: number, dto: UpdateCameraDto): Promise<Camera> {
    const camera = await this.cameraRepo.findOne({
      where: { id },
      relations: ['inventory'],
    });
    if (!camera) throw new NotFoundException('Камера не найдена');
  
    if (dto.ipAddress) camera.ipAddress = dto.ipAddress;
  
    if (dto.inventoryId) {
      const inventory = await this.inventoryRepo.findOneBy({ id: dto.inventoryId });
      if (!inventory) throw new NotFoundException('Инвентарь не найден');
      camera.inventory = inventory;
    }
  
    return this.cameraRepo.save(camera);
  }

  async remove(id: number): Promise<void> {
    const found = await this.cameraRepo.findOneBy({ id });
    if (!found) throw new NotFoundException('Камера не найдена');
    await this.cameraRepo.remove(found);
  }

  async updateStatus(id: number, isOnline: boolean) {
    await this.cameraRepo.update(id, {
      isOnline,
      offlineSince: isOnline ? null : new Date(),
    });
    this.gateway.sendCameraStatusUpdate(id, isOnline);
  }
}
