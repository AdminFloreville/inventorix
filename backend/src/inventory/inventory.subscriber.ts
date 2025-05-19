import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inventory } from './inventory.entity';
import { HistoryService } from '../history/history.service';

@Injectable()
@EventSubscriber()
export class InventorySubscriber implements EntitySubscriberInterface<Inventory> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly historyService: HistoryService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Inventory;
  }

  async afterInsert(event: InsertEvent<Inventory>) {
    await this.historyService.logChange(
      'create',
      'inventory',
      event.entity.id,
      event.entity,
    );
  }

  async afterUpdate(event: UpdateEvent<Inventory>) {
    if (!event.entity) return;
    
    await this.historyService.logChange(
      'update',
      'inventory',
      event.entity.id,
      event.entity,
    );
  }

  async beforeRemove(event: RemoveEvent<Inventory>) {
    if (!event.entity) return;
    
    await this.historyService.logChange(
      'delete',
      'inventory',
      event.entity.id,
      event.entity,
    );
  }
} 