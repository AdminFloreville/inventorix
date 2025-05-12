import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,
  ) {}

  async logChange(
    action: 'create' | 'update' | 'delete',
    entity: string,
    entityId: number,
    payload: any,
  ) {
    const record = this.historyRepo.create({ action, entity, entityId, payload });
    return this.historyRepo.save(record);
  }

  async findAll() {
    return this.historyRepo.find({
      order: { timestamp: 'DESC' },
    });
  }
}
