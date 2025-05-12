import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { InventoryPartService } from './inventory-part.service';
import { CreateInventoryPartDto } from './dto/create-inventory-part.dto';
import { UpdateInventoryPartDto } from './dto/update-inventory-part.dto';

@Controller('inventory')
export class InventoryPartController {
  constructor(private readonly partService: InventoryPartService) {}

  @Get(':id/parts')
  getAll(@Param('id') id: string) {
    return this.partService.findAllByInventory(+id);
  }

  @Post(':id/parts')
  create(@Param('id') id: string, @Body() dto: CreateInventoryPartDto) {
    return this.partService.create(+id, dto);
  }

  @Put('parts/:id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryPartDto) {
    return this.partService.update(+id, dto);
  }

  @Delete('parts/:id')
  remove(@Param('id') id: string) {
    return this.partService.remove(+id);
  }
}
