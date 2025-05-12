// src/devices/camera/camera.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  import { Logger } from '@nestjs/common';
  
  @WebSocketGateway({ cors: true })
  export class CameraGateway {
    @WebSocketServer()
    server: Server;
  
    private logger = new Logger(CameraGateway.name);
  
    notifyCameraStatus(cameraId: number, isOnline: boolean) {
      this.logger.log(`Broadcast: Camera ${cameraId} is ${isOnline ? 'online' : 'offline'}`);
      this.server.emit('cameraStatusChanged', { id: cameraId, isOnline });
    }

    sendCameraStatusUpdate(cameraId: number, isOnline: boolean) {
      this.server.emit('cameraStatus', { id: cameraId, isOnline });
    }
  }
  