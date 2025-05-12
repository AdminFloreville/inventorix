// src/devices/printer/printer-monitor.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ping from 'ping';
import { Printer } from './printer.entity';
import { PrinterGateway } from './printer.gateway';

@Injectable()
export class PrinterMonitorService {
  constructor(
    @InjectRepository(Printer)
    private readonly printerRepo: Repository<Printer>,
    private readonly printerGateway: PrinterGateway,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async pingEachPrinter() {
    const printers = await this.printerRepo.find();

    for (const printer of printers) {
      const result = await ping.promise.probe(printer.ipAddress, {
        timeout: 2,
        extra: ['-i', '2'],
      });

      const isOnline = result.alive;

      if (printer.isOnline !== isOnline) {
        await this.printerRepo.update(printer.id, { isOnline });
        this.printerGateway.sendPrinterStatusUpdate(printer.id, isOnline);
      }
    }
  }
}
