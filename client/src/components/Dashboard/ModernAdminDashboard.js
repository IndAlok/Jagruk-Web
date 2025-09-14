import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Drawer,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
  alpha,
  Switch,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

const ModernAdminDashboard = () => {
  const theme = useTheme();
  const { darkMode, toggleTheme } = useCustomTheme();
  const { currentUser, logout } = useAuth();
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalStudents: 1247,
          totalStaff: 89,
          activeDrills: 3,
          systemHealth: 98.5,
          completedDrills: 47,
          pendingAlerts: 2,
          participationRate: 94.2,
          responseTime: '1.8s'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Sidebar menu items
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: DashboardIcon,
      color: '#4F46E5',
      gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: PeopleIcon,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)'
    },
    {
      id: 'security',
      label: 'Security & Drills',
      icon: SecurityIcon,
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #EA580C 100%)'
    }
  ];

  // Quick stats cards data
  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents?.toLocaleString() || '0',
      icon: SchoolIcon,
      color: '#4F46E5',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Staff Members',
      value: stats.totalStaff || '0',
      icon: PeopleIcon,
      color: '#059669',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Active Drills',
      value: stats.activeDrills || '0',
      icon: ScheduleIcon,
      color: '#DC2626',
      trend: 'Live',
      trendUp: true
    },
    {
      title: 'System Health',
      value: `${stats.systemHealth || 100}%`,
      icon: CheckCircleIcon,
      color: '#059669',
      trend: stats.systemHealth > 95 ? 'Excellent' : 'Good',
      trendUp: stats.systemHealth > 95
    }
  ];

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Navigation will be handled by the App component
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Modern App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'transparent',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(255, 255, 255, 0.1)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          {/* Hamburger Menu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
            sx={{
              mr: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <WarningIcon 
                sx={{ 
                  fontSize: 32, 
                  color: theme.palette.primary.main, 
                  mr: 2 
                }} 
              />
            </motion.div>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              JAGRUK Admin
            </Typography>
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 1),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 1),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Badge badgeContent={stats.pendingAlerts} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Profile & Settings">
              <IconButton
                onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 1),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {currentUser?.name?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu Dropdown */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {currentUser?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
          Profile Settings
        </MenuItem>
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Preferences
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={() => setNotificationMenuAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxHeight: 400,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Fire Drill Scheduled
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tomorrow at 2:30 PM - Building A
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              System Update Complete
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Emergency response system updated
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Modern Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: alpha(theme.palette.background.default, 0.95),
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 700,
              letterSpacing: 1
            }}
          >
            NAVIGATION
          </Typography>

          <Box sx={{ mt: 2 }}>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: activeSection === item.id 
                      ? `2px solid ${item.color}` 
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    bgcolor: activeSection === item.id 
                      ? alpha(item.color, 0.1)
                      : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(item.color, 0.05),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(item.color, 0.15)}`
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: item.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <item.icon />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.id === 'overview' && 'Dashboard & Analytics'}
                          {item.id === 'users' && 'Students & Staff'}
                          {item.id === 'security' && 'Emergency Management'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          overflow: 'auto',
          pt: 10,
          pb: 3,
          px: 3
        }}
      >
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Welcome Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Welcome back, {currentUser?.name}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Here's what's happening at your school today
                </Typography>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={3} mb={4}>
                {statsCards.map((card, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          background: `linear-gradient(135deg, ${alpha(card.color, 0.1)} 0%, ${alpha(card.color, 0.05)} 100%)`,
                          border: `1px solid ${alpha(card.color, 0.2)}`,
                          '&:hover': {
                            boxShadow: `0 12px 40px ${alpha(card.color, 0.15)}`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}
                            >
                              <card.icon />
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                              {loading ? '...' : card.value}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {card.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon 
                              sx={{ 
                                fontSize: 16, 
                                color: card.trendUp ? 'success.main' : 'error.main',
                                transform: card.trendUp ? 'none' : 'rotate(180deg)'
                              }} 
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: card.trendUp ? 'success.main' : 'error.main',
                                fontWeight: 'bold'
                              }}
                            >
                              {card.trend}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Additional Dashboard Content */}
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Recent Activities
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Live feed of system activities and user interactions
                      </Typography>
                      {/* Activity feed would go here */}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Button variant="outlined" fullWidth>
                          Schedule Emergency Drill
                        </Button>
                        <Button variant="outlined" fullWidth>
                          Send Notification
                        </Button>
                        <Button variant="outlined" fullWidth>
                          Generate Report
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                User Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage students, staff, and user accounts
              </Typography>
              {/* User management content */}
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Security & Emergency Drills
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage emergency procedures and safety protocols
              </Typography>
              {/* Security content */}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(79, 70, 229, 0.3)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => toast.success('Quick action triggered!')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ModernAdminDashboard;
