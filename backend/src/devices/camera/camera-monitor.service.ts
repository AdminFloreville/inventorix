import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as ping from 'ping';
import { InjectRepository } from '@nestjs/typeorm';
import { Camera } from './camera.entity';
import { Repository } from 'typeorm';
import { CameraGateway } from './camera.gateway';

@Injectable()
export class CameraMonitorService {
  constructor(
    @InjectRepository(Camera)
    private readonly cameraRepo: Repository<Camera>,
    private readonly cameraGateway: CameraGateway,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async pingEachCamera() {
    const cameras = await this.cameraRepo.find();

    for (const cam of cameras) {
      const res = await ping.promise.probe(cam.ipAddress, {
        timeout: 2,
        extra: ['-i', '2'],
      });

      const isOnline = res.alive;

      // Обновляем только если статус изменился
      if (cam.isOnline !== isOnline) {
        await this.cameraRepo.update(cam.id, { isOnline });
        this.cameraGateway.sendCameraStatusUpdate(cam.id, isOnline);
      }
    }
  }
}
