// src/devices/printer/printer.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PrinterGateway {
  @WebSocketServer()
  server: Server;

  sendPrinterStatusUpdate(printerId: number, isOnline: boolean) {
    this.server.emit('printer-status', { printerId, isOnline });
  }
}
