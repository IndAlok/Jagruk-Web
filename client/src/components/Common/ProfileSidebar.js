import React from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Box,
  Typography,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import NotificationCenter from './NotificationCenter';

const menuOptions = {
  admin: [
    { text: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
    { text: 'My Profile', icon: <ProfileIcon />, key: 'profile' },
    { text: 'User Management', icon: <PeopleIcon />, key: 'users' },
    { text: 'Security', icon: <SecurityIcon />, key: 'security' },
    { text: 'Settings', icon: <SettingsIcon />, key: 'settings' },
  ],
  staff: [
    { text: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
    { text: 'My Profile', icon: <ProfileIcon />, key: 'profile' },
    { text: 'Students', icon: <SchoolIcon />, key: 'students' },
    { text: 'Notifications', icon: <NotificationsIcon />, key: 'notifications' },
    { text: 'Settings', icon: <SettingsIcon />, key: 'settings' },
  ],
  student: [
    { text: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
    { text: 'My Profile', icon: <ProfileIcon />, key: 'profile' },
    { text: 'My Courses', icon: <SchoolIcon />, key: 'courses' },
    { text: 'Notifications', icon: <NotificationsIcon />, key: 'notifications' },
    { text: 'Settings', icon: <SettingsIcon />, key: 'settings' },
  ]
};

const ProfileSidebar = ({
  open,
  onOpen,
  onClose,
  role = 'student',
  onMenuClick,
  onLogout,
  profileMenuAnchor,
  onProfileMenuOpen,
  onProfileMenuClose,
  onSettings,
  onProfile,
  onThemeToggle,
  darkMode,
  user,
  notifications = [],
  onMarkAsRead,
  onNotificationClick
}) => {
  const { darkMode: globalDarkMode, toggleTheme } = useCustomTheme();
  const options = menuOptions[role] || menuOptions.student;
  const currentDarkMode = darkMode !== undefined ? darkMode : globalDarkMode;

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: currentDarkMode 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={onOpen} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            JAGRUK {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={currentDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton color="inherit" onClick={onThemeToggle || toggleTheme}>
                {currentDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onNotificationClick={onNotificationClick}
              role={role}
            />

            <IconButton color="inherit" onClick={onProfileMenuOpen}>
              <Avatar 
                src={user?.profilePhoto || user?.photoURL} 
                alt={user?.displayName || user?.name || 'Profile'}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'rgba(255,255,255,0.2)' 
                }}
              >
                {(user?.displayName || user?.name || role.charAt(0)).charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu 
        anchorEl={profileMenuAnchor} 
        open={Boolean(profileMenuAnchor)} 
        onClose={onProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={onProfile}>
          <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={onSettings}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer 
        anchor="left" 
        open={open} 
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: currentDarkMode ? '#1a1a1a' : 'white',
            borderRight: `1px solid ${alpha('#000', 0.12)}`,
          }
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: currentDarkMode ? 'white' : 'inherit' }}>
            Navigation
          </Typography>
          <List>
            {options.map((item) => (
              <ListItem 
                button 
                key={item.key} 
                onClick={() => onMenuClick && onMenuClick(item.key)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.1),
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#667eea' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ProfileSidebar;
