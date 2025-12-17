import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { alertsAPI } from '../../services/api';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'success':
      return <SuccessIcon color="success" />;
    default:
      return <InfoIcon color="info" />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'warning':
      return '#ff9800';
    case 'error':
      return '#f44336';
    case 'success':
      return '#4caf50';
    default:
      return '#2196f3';
  }
};

const NotificationCenter = ({ 
  notifications: propNotifications = [], 
  onMarkAsRead: propOnMarkAsRead, 
  onNotificationClick,
  role = 'student' 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  
  // Fetch real alerts when component mounts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await alertsAPI.getActive();
        // API returns { success: true, data: [...] }
        const activeAlerts = response?.data || response || [];
        const alertsArray = Array.isArray(activeAlerts) ? activeAlerts : [];
        
        const formattedAlerts = alertsArray.map(alert => ({
          id: alert.id,
          title: alert.title,
          message: alert.message,
          type: alert.severity || 'info',
          timestamp: alert.createdAt,
          read: false,
          isAlert: true
        }));
        setAlerts(formattedAlerts);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  // Merge prop notifications with fetched alerts
  const allNotifications = [...alerts, ...propNotifications].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    // If it's a local alert, mark as read locally
    if (notification.isAlert) {
      setAlerts(prev => prev.map(a => 
        a.id === notification.id ? { ...a, read: true } : a
      ));
    } else if (propOnMarkAsRead && !notification.read) {
      propOnMarkAsRead(notification.id);
    }
  };

  const markAllRead = () => {
    // Mark local alerts read
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    
    // Trigger prop mark read
    propNotifications.forEach(n => {
      if (!n.read && propOnMarkAsRead) {
        propOnMarkAsRead(n.id);
      }
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip 
              label={`${unreadCount} unread`} 
              size="small" 
              color="primary" 
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
          {loading && alerts.length === 0 ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <AnimatePresence>
              {allNotifications.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No notifications" 
                    secondary="You're all caught up!" 
                    sx={{ textAlign: 'center' }}
                  />
                </ListItem>
              ) : (
                allNotifications.map((notification) => (
                  <motion.div
                    key={`${notification.isAlert ? 'alert' : 'notif'}-${notification.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItem 
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        '&:hover': {
                          bgcolor: 'action.selected'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: `${getNotificationColor(notification.type)}20`,
                          color: getNotificationColor(notification.type)
                        }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        primaryTypographyProps={{
                          variant: 'subtitle2',
                          fontWeight: notification.read ? 'normal' : 'bold'
                        }}
                        secondary={
                          <>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              component="span"
                              sx={{ 
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {notification.description || notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="span">
                              {formatTime(notification.timestamp)}
                            </Typography>
                          </>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            ml: 1
                          }}
                        />
                      )}
                    </ListItem>
                    <Divider />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </List>

        {allNotifications.length > 0 && unreadCount > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <MenuItem 
                onClick={markAllRead}
                sx={{ justifyContent: 'center' }}
              >
                <MarkReadIcon sx={{ mr: 1 }} />
                Mark all as read
              </MenuItem>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;
