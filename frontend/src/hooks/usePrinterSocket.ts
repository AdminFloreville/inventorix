import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { printerStore } from '../stores/printerStore';

export const usePrinterSocket = () => {
  useEffect(() => {
    const socket = io('http://localhost:3000'); // или твой адрес

    socket.on('printer-status', ({ id, isOnline }) => {
      printerStore.updateStatus(id, isOnline);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};
