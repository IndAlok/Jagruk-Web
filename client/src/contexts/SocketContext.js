import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const serverUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const newSocket = io(serverUrl, {
        auth: {
          userId: user.uid,
          role: user.role,
          schoolId: user.schoolId
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        
        // Join school room
        newSocket.emit('join-school', user.schoolId);
        
        // Join class room if student
        if (user.role === 'student') {
          newSocket.emit('join-class', `${user.schoolId}-class-${user.class}`);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      // Handle drill notifications
      newSocket.on('drill-scheduled', (data) => {
        toast.info(`New drill scheduled: ${data.title}`, {
          position: "top-right",
          autoClose: 5000
        });
      });

      newSocket.on('drill-started', (data) => {
        toast.warning(`Drill started: ${data.title}`, {
          position: "top-center",
          autoClose: false,
          closeOnClick: false
        });
      });

      newSocket.on('drill-notification', (data) => {
        if (user.role === 'student') {
          toast.info(`Drill Alert: ${data.title}`, {
            position: "top-center",
            autoClose: 10000
          });
        }
      });

      // Handle emergency alerts
      newSocket.on('emergency-broadcast', (data) => {
        toast.error(`EMERGENCY: ${data.message}`, {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          className: 'emergency-toast'
        });
        
        // Create browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification('EMERGENCY ALERT', {
            body: data.message,
            icon: '/emergency-icon.png',
            requireInteraction: true
          });
        }
      });

      // Handle school alerts
      newSocket.on('school-alert', (data) => {
        const toastType = data.priority === 'high' ? toast.warning : toast.info;
        toastType(`Alert: ${data.title}`, {
          position: "top-right",
          autoClose: data.priority === 'high' ? 10000 : 5000
        });
      });

      // Handle attendance updates
      newSocket.on('attendance-update', (data) => {
        if (user.role !== 'student') {
          toast.success(`Attendance marked by student`, {
            position: "bottom-right",
            autoClose: 3000
          });
        }
      });

      // Handle module completion updates
      newSocket.on('module-completed', (data) => {
        if (user.role !== 'student') {
          toast.success(`${data.studentName} completed a module with score ${data.score}%`, {
            position: "bottom-right",
            autoClose: 3000
          });
        }
      });

      // Handle progress updates
      newSocket.on('progress-update', (data) => {
        console.log('Progress update received:', data);
      });

      // Handle alert dismissals
      newSocket.on('alert-dismissed', (data) => {
        console.log('Alert dismissed:', data.alertId);
      });

      // Handle online users updates
      newSocket.on('online-users-update', (users) => {
        setOnlineUsers(users);
      });

      // Handle connection errors
      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        toast.error('Connection to server failed');
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const emitDrillAlert = (alertData) => {
    if (socket) {
      socket.emit('drill-alert', alertData);
    }
  };

  const emitEmergencyAlert = (alertData) => {
    if (socket) {
      socket.emit('emergency-alert', alertData);
    }
  };

  const emitAttendanceUpdate = (attendanceData) => {
    if (socket) {
      socket.emit('drill-attendance', attendanceData);
    }
  };

  const emitModuleProgress = (progressData) => {
    if (socket) {
      socket.emit('module-progress', progressData);
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    emitDrillAlert,
    emitEmergencyAlert,
    emitAttendanceUpdate,
    emitModuleProgress
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
