import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { printerStore } from '../stores/printerStore';

export const usePrinterSocket = () => {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL);

    socket.on('printer-status', ({ id, isOnline }) => {
      printerStore.updateStatus(id, isOnline);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};
