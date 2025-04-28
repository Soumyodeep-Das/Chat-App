import React, { createContext, useContext, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    const token = localStorage.getItem('token');
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      auth: token ? { token } : undefined
    });
  }

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
