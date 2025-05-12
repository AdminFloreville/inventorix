import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Get()
  findAll() {
    return this.cameraService.findAll();
  }

  @Get()
  getAll(
    @Query('search') search: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.cameraService.paginatedSearch(search, +limit, +offset);
  }

  @Post()
  create(@Body() dto: CreateCameraDto) {
    return this.cameraService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCameraDto) {
    return this.cameraService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cameraService.remove(+id);
  }
}
