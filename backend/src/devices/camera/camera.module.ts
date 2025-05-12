import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './camera.entity';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { Inventory } from '../../inventory/inventory.entity';
import { CameraMonitorService } from './camera-monitor.service';
import { CameraGateway } from './camera.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Camera, Inventory])],
  providers: [CameraService, CameraGateway, CameraMonitorService],
  controllers: [CameraController],
})
export class CameraModule {}
