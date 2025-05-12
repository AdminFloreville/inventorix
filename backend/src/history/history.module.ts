import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  providers: [HistoryService],
  exports: [HistoryService],
  controllers: [HistoryController], // важно!
})
export class HistoryModule {}
