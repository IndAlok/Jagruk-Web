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
  Fab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  NotificationsActive as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  Warning as EmergencyIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const StaffDashboard = ({ user }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stats, setStats] = useState({
    assignedStudents: 0,
    completedDrills: 0,
    pendingTasks: 0,
    notifications: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate loading dashboard data for staff
      setTimeout(() => {
        setStats({
          assignedStudents: 45,
          completedDrills: 12,
          pendingTasks: 3,
          notifications: 2,
        });
        setRecentActivity([
          { title: 'Fire drill completed successfully', date: '2025-09-14' },
          { title: 'Student attendance updated', date: '2025-09-13' },
          { title: 'Emergency contact list updated', date: '2025-09-12' },
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

  const StatCard = ({ title, value, icon, color, trend }) => (
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
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color }}>
                {loading ? '...' : value}
              </Typography>
              {trend && (
                <Chip 
                  label={trend} 
                  size="small" 
                  sx={{ mt: 1, bgcolor: `${color}20`, color }} 
                />
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
              }}
            >
              {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const tabContent = [
    // Overview Tab
    <Box key="overview">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Students"
            value={stats.assignedStudents}
            icon={<SchoolIcon />}
            color="#1976d2"
            trend="Active"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Drills"
            value={stats.completedDrills}
            icon={<EmergencyIcon />}
            color="#388e3c"
            trend="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={<AssignmentIcon />}
            color="#f57c00"
            trend="Due soon"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Notifications"
            value={stats.notifications}
            icon={<NotificationsIcon />}
            color="#d32f2f"
            trend="Unread"
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
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} divider={index < recentActivity.length - 1}>
                      <ListItemIcon>
                        <AssignmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={new Date(activity.date).toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                  {recentActivity.length === 0 && (
                    <ListItem>
                      <ListItemText 
                        primary="No recent activity" 
                        secondary="Your activities will appear here"
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
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PersonAddIcon />}
                    onClick={() => toast.info('Feature coming soon!')}
                  >
                    Add Student
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EmergencyIcon />}
                    onClick={() => toast.info('Feature coming soon!')}
                  >
                    Conduct Drill
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AssignmentIcon />}
                    onClick={() => toast.info('Feature coming soon!')}
                  >
                    View Tasks
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>,
    
    // Students Tab
    <Box key="students">
      <Typography variant="h5" gutterBottom>
        Student Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Manage your assigned students, track their attendance, and monitor their emergency drill participation.
        </Typography>
      </Paper>
    </Box>,
    
    // Drills Tab
    <Box key="drills">
      <Typography variant="h5" gutterBottom>
        Emergency Drills
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Conduct emergency drills, track participation, and submit reports to administration.
        </Typography>
      </Paper>
    </Box>,
    
    // Tasks Tab
    <Box key="tasks">
      <Typography variant="h5" gutterBottom>
        Assigned Tasks
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          View and manage your assigned tasks from the administration team.
        </Typography>
      </Paper>
    </Box>,
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <PeopleIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Staff Dashboard
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
              Welcome back, {user?.name || 'Staff'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your students and conduct emergency drills effectively.
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
            <Tab icon={<SchoolIcon />} label="Students" />
            <Tab icon={<EmergencyIcon />} label="Drills" />
            <Tab icon={<AssignmentIcon />} label="Tasks" />
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

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
        onClick={() => toast.info('Quick actions coming soon!')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default StaffDashboard;
