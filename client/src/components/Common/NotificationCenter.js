import React, { useState } from 'react';
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
  ListItemText
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
  notifications = [], 
  onMarkAsRead, 
  onNotificationClick,
  role = 'student' 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const unreadCount = notifications.filter(n => !n.read).length;

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
    if (onMarkAsRead && !notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const formatTime = (timestamp) => {
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
          <AnimatePresence>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="No notifications" 
                  secondary="You're all caught up!" 
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
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
                      secondary={`${notification.description || notification.message} • ${formatTime(notification.timestamp)}`}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        fontWeight: notification.read ? 'normal' : 'bold'
                      }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                        sx: { 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }
                      }}
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
        </List>

        {notifications.length > 0 && unreadCount > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <MenuItem 
                onClick={() => {
                  notifications.forEach(n => {
                    if (!n.read && onMarkAsRead) {
                      onMarkAsRead(n.id);
                    }
                  });
                }}
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
