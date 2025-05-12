// src/devices/printer/printer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './printer.entity';
import { Inventory } from 'src/inventory/inventory.entity';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';
import { PrinterMonitorService } from './printer-monitor.service';
import { PrinterGateway } from './printer.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Printer, Inventory])],
  providers: [PrinterService, PrinterMonitorService, PrinterGateway],
  controllers: [PrinterController],
})
export class PrinterModule {}
