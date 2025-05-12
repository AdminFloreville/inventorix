// src/inventory/inventory.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { InventoryService } from './inventory.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @UseGuards(JwtAuthGuard)
  @Controller('inventory')
  export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
  
    @Get()
    getAll() {
      return this.inventoryService.findAll();
    }
  
    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
      return this.inventoryService.findOne(id);
    }
  
    @Post()
    create(@Body() body: any) {
      return this.inventoryService.create(body);
    }
  
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
      return this.inventoryService.update(id, body);
    }
  
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.inventoryService.remove(id);
    }
  }
  