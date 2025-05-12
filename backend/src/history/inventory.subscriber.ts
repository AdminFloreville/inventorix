// src/inventory/inventory.subscriber.ts
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
  } from 'typeorm';
  import { HistoryService } from '../history/history.service';
import { Inventory } from 'src/inventory/inventory.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class InventorySubscriber
  implements EntitySubscriberInterface<Inventory>, OnModuleInit
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly historyService: HistoryService,
  ) {}

  listenTo() {
    return Inventory;
  }

  onModuleInit() {
    this.dataSource.subscribers.push(this); // 🔥 вот ключ
  }

  async afterInsert(event: InsertEvent<Inventory>) {
    await this.historyService.logChange('create', 'inventory', event.entity.id, event.entity);
  }

  async afterUpdate(event: UpdateEvent<Inventory>) {
    const entityId = event.entity?.id ?? (event.databaseEntity as Inventory)?.id;
    const payload = event.entity ?? event.databaseEntity;
    if (entityId && payload) {
      await this.historyService.logChange('update', 'inventory', entityId, payload);
    }
  }

  async afterRemove(event: RemoveEvent<Inventory>) {
    const entityId = event.entity?.id ?? (event.databaseEntity as Inventory)?.id;
    const payload = event.databaseEntity ?? event.entity;
    if (entityId && payload) {
      await this.historyService.logChange('delete', 'inventory', entityId, payload);
    }
  }
}
