import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { cameraStore } from '../stores/cameraStore';

export const useCameraSocket = () => {
  useEffect(() => {
    const socket = io('http://localhost:3000'); // или твой адрес

    socket.on('cameraStatus', ({ id, isOnline }) => {
      cameraStore.updateStatus(id, isOnline);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};
