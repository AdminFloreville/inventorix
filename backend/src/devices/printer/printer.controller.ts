// src/devices/printer/printer.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Controller('printer')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Get()
  findAll() {
    return this.printerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printerService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreatePrinterDto) {
    return this.printerService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrinterDto) {
    return this.printerService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printerService.remove(+id);
  }
}
