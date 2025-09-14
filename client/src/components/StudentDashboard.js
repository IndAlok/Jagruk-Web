import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  NotificationsActive as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Warning as EmergencyIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const StudentDashboard = ({ user }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stats, setStats] = useState({
    drillsAttended: 0,
    totalDrills: 0,
    attendanceRate: 0,
    notifications: 0,
  });
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate loading dashboard data for student
      setTimeout(() => {
        setStats({
          drillsAttended: 8,
          totalDrills: 10,
          attendanceRate: 95,
          notifications: 3,
        });
        setRecentNotifications([
          { title: 'Fire drill scheduled for tomorrow', type: 'warning', date: '2025-09-14' },
          { title: 'Emergency contact information updated', type: 'info', date: '2025-09-13' },
          { title: 'Drill attendance recorded successfully', type: 'success', date: '2025-09-12' },
        ]);
        setUpcomingEvents([
          { title: 'Fire Safety Drill', date: '2025-09-15', time: '10:00 AM' },
          { title: 'Earthquake Preparedness Session', date: '2025-09-20', time: '2:00 PM' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
    handleMenuClose();
  };

  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
          border: `1px solid ${color}30`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color, mb: 1 }}>
                {loading ? '...' : value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {subtitle}
                </Typography>
              )}
              {progress !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: `${color}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                      }
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {progress}% Complete
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                bgcolor: `${color}20`,
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ml: 2,
              }}
            >
              {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
      default:
        return <InfoIcon color="info" />;
    }
  };

  const tabContent = [
    // Overview Tab
    <Box key="overview">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Drills Attended"
            value={`${stats.drillsAttended}/${stats.totalDrills}`}
            icon={<EmergencyIcon />}
            color="#1976d2"
            subtitle="This semester"
            progress={(stats.drillsAttended / stats.totalDrills) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon={<CheckCircleIcon />}
            color="#388e3c"
            subtitle="Overall performance"
            progress={stats.attendanceRate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Safety Score"
            value="Excellent"
            icon={<SchoolIcon />}
            color="#f57c00"
            subtitle="Keep it up!"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Notifications"
            value={stats.notifications}
            icon={<NotificationsIcon />}
            color="#d32f2f"
            subtitle="Unread messages"
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Notifications
                </Typography>
                <List>
                  {recentNotifications.map((notification, index) => (
                    <ListItem key={index} divider={index < recentNotifications.length - 1}>
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.title}
                        secondary={new Date(notification.date).toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                  {recentNotifications.length === 0 && (
                    <ListItem>
                      <ListItemText 
                        primary="No new notifications" 
                        secondary="You're all caught up!"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {upcomingEvents.map((event, index) => (
                    <Alert 
                      key={index} 
                      severity="info" 
                      sx={{ 
                        '& .MuiAlert-message': { width: '100%' },
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {event.title}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </Typography>
                    </Alert>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      No upcoming events
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>,
    
    // Drills Tab
    <Box key="drills">
      <Typography variant="h5" gutterBottom>
        Emergency Drills
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track your participation in emergency drills and safety training sessions.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Drill History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your drill participation history and performance will be displayed here.
          </Typography>
        </Box>
      </Paper>
    </Box>,
    
    // Profile Tab
    <Box key="profile">
      <Typography variant="h5" gutterBottom>
        Student Profile
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  mb: 2,
                }}
              >
                {user?.name?.charAt(0) || 'S'}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.name || 'Student Name'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Student ID: {user?.studentId || 'STU001'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{user?.email || 'student@example.com'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Department</Typography>
                <Typography variant="body1">{user?.department || 'Computer Science'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Year</Typography>
                <Typography variant="body1">{user?.year || '3rd Year'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                <Typography variant="body1">{user?.emergencyContact || 'Not provided'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>,
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Student Dashboard
          </Typography>
          
          <Badge badgeContent={stats.notifications} color="error" sx={{ mr: 2 }}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Badge>
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0) || 'S'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box mb={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome, {user?.name || 'Student'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay prepared and track your emergency readiness progress.
            </Typography>
          </Box>
        </motion.div>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<DashboardIcon />} label="Overview" />
            <Tab icon={<EmergencyIcon />} label="Drills" />
            <Tab icon={<PersonIcon />} label="Profile" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
