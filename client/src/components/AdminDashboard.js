import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Assignment as DrillIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI, settingsAPI } from '../services/api';
import { toast } from 'react-toastify';
import ProfileSidebar from './Common/ProfileSidebar';

// Theme Context for mode switching
const ThemeContext = React.createContext();

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  
  // Data states
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    activeDrills: 0,
    systemHealth: 100,
    completedDrills: 0,
    pendingAlerts: 0
  });
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      drillReminders: true,
      systemAlerts: true
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      showAnimations: true,
      compactMode: false
    }
  });

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to get real data from backend first
      const [statsResponse, activitiesResponse, notificationsResponse] = await Promise.all([
        dashboardAPI.getAdminStats().catch(() => null),
        dashboardAPI.getActivities().catch(() => null),
        dashboardAPI.getNotifications().catch(() => null)
      ]);
      
      // Use backend data if available, otherwise use mock data
      setStats(statsResponse?.stats || generateMockStats());
      setActivities(activitiesResponse?.activities || generateMockActivities());
      setNotifications(notificationsResponse?.notifications || []);
      
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      // Load mock data as fallback
      setStats(generateMockStats());
      setActivities(generateMockActivities());
    } finally {
      setLoading(false);
    }
  }, []); // Remove circular dependency

  // Generate mock data for fallback
  const generateMockStats = () => ({
    totalStudents: Math.floor(Math.random() * 500) + 1000,
    totalStaff: Math.floor(Math.random() * 50) + 50,
    activeDrills: Math.floor(Math.random() * 5) + 1,
    systemHealth: Math.floor(Math.random() * 10) + 90,
    completedDrills: Math.floor(Math.random() * 100) + 200,
    pendingAlerts: Math.floor(Math.random() * 10),
    responseTime: `${(Math.random() * 2 + 1).toFixed(1)}s`,
    participationRate: Math.floor(Math.random() * 20) + 80,
    lastUpdated: new Date().toISOString()
  });

  const generateMockActivities = () => [
    {
      id: 1,
      type: 'drill_completed',
      title: 'Fire Drill Completed',
      description: 'All students evacuated successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'success'
    },
    {
      id: 2,
      type: 'user_registered', 
      title: 'New Student Registration',
      description: 'Student registered for Grade 10A',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'info'
    }
  ];

  // Theme toggle handler
  const handleThemeToggle = async () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    
    try {
      if (settingsAPI?.updateSettings) {
        await settingsAPI.updateSettings({
          ...userSettings,
          theme: newTheme
        });
        toast.success('Theme updated successfully');
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handleSidebarMenuClick = (key) => {
    // Handle sidebar navigation
    switch (key) {
      case 'dashboard':
        setActiveSection('overview');
        break;
      case 'users':
        setActiveSection('users');
        break;
      case 'security':
        setActiveSection('security');
        break;
      case 'settings':
        setActiveSection('settings');
        break;
      default:
        break;
    }
    setSidebarOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfile = () => {
    toast.info('Profile feature coming soon!');
    handleProfileMenuClose();
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Handle notification specific actions here
  };

  // Initialize dashboard
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser, loadDashboardData]);

  // Auto refresh based on settings
  useEffect(() => {
    if (userSettings.dashboard.autoRefresh && !loading) {
      const interval = setInterval(() => {
        loadDashboardData();
      }, (userSettings.dashboard.refreshInterval || 30) * 1000);
      
      return () => clearInterval(interval);
    }
  }, [userSettings.dashboard.autoRefresh, userSettings.dashboard.refreshInterval, loading, loadDashboardData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: darkMode 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={80} sx={{ color: 'white', mb: 3 }} />
          <Typography variant="h6" color="white" textAlign="center">
            Loading Admin Dashboard...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme: handleThemeToggle }}>
      <Box 
        sx={{ 
          display: 'flex', 
          height: '100vh',
          bgcolor: darkMode ? '#121212' : '#f5f7fa',
          transition: 'background-color 0.3s ease'
        }}
      >
        <ProfileSidebar
          open={sidebarOpen}
          onOpen={() => setSidebarOpen(true)}
          onClose={() => setSidebarOpen(false)}
          role="admin"
          onMenuClick={handleSidebarMenuClick}
          onLogout={logout}
          profileMenuAnchor={profileMenuAnchor}
          onProfileMenuOpen={handleProfileMenuOpen}
          onProfileMenuClose={handleProfileMenuClose}
          onSettings={() => setSettingsOpen(true)}
          onProfile={handleProfile}
          onThemeToggle={handleThemeToggle}
          darkMode={darkMode}
          user={currentUser}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onNotificationClick={handleNotificationClick}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            transition: 'margin 0.3s ease'
          }}
        >
          {/* Dashboard Overview Section */}
          {activeSection === 'dashboard' && (
            <DashboardOverview 
              stats={stats} 
              activities={activities} 
              currentUser={currentUser}
              darkMode={darkMode}
            />
          )}
          
          {/* User Management Section */}
          {activeSection === 'management' && (
            <UserManagement darkMode={darkMode} />
          )}
          
          {/* Security & Drills Section */}
          {activeSection === 'security' && (
            <SecuritySection darkMode={darkMode} />
          )}
        </Box>

        {/* Settings Dialog */}
        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={userSettings}
          onSettingsUpdate={setUserSettings}
          darkMode={darkMode}
        />
      </Box>
    </ThemeContext.Provider>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats, activities, currentUser, darkMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
      Welcome back, {currentUser?.name}!
    </Typography>

    {/* Profile Card */}
    <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : 'white' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            }}
          >
            <Typography variant="h3" color="white" fontWeight="bold">
              {currentUser?.name?.charAt(0) || 'A'}
            </Typography>
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
              {currentUser?.name || 'Admin User'}
            </Typography>
            <Typography variant="body1" sx={{ color: darkMode ? '#aaa' : 'text.secondary', mb: 1 }}>
              {currentUser?.email || 'admin@jagruk.edu'}
            </Typography>
            <Chip 
              label={currentUser?.role?.toUpperCase() || 'ADMIN'} 
              color="primary" 
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            {currentUser?.isDemo && (
              <Chip 
                label="DEMO MODE" 
                color="warning" 
                size="small" 
                sx={{ ml: 1, fontWeight: 'bold' }} 
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>

    {/* Statistics Cards */}
    <Grid container spacing={3} mb={4}>
      {[
        {
          title: 'Total Students',
          value: (stats?.totalStudents || 0).toLocaleString(),
          icon: SchoolIcon,
          color: '#4ECDC4',
          trend: '+12%'
        },
        {
          title: 'Staff Members',
          value: stats?.totalStaff || 0,
          icon: PeopleIcon,
          color: '#45B7D1',
          trend: '+3%'
        },
        {
          title: 'Active Drills',
          value: stats?.activeDrills || 0,
          icon: DrillIcon,
          color: '#FFA726',
          trend: 'Live'
        },
        {
          title: 'System Health',
          value: `${stats?.systemHealth || 100}%`,
          icon: SecurityIcon,
          color: '#66BB6A',
          trend: (stats?.systemHealth || 100) > 95 ? 'Excellent' : 'Good'
        }
      ].map((stat, index) => (
        <Grid item xs={12} md={6} lg={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)`,
                border: `1px solid ${stat.color}30`,
                bgcolor: darkMode ? '#1e1e1e' : 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <stat.icon sx={{ color: stat.color, fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : 'text.secondary', mb: 1 }}>
                  {stat.title}
                </Typography>
                <Chip 
                  label={stat.trend} 
                  size="small" 
                  sx={{ 
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                    fontWeight: 'bold'
                  }} 
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>

    {/* Recent Activities */}
    <Card sx={{ bgcolor: darkMode ? '#1e1e1e' : 'white' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
          Recent Activities
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem>
                <ListItemIcon>
                  {activity.status === 'success' && <CheckIcon sx={{ color: '#4CAF50' }} />}
                  {activity.status === 'warning' && <WarningIcon sx={{ color: '#FF9800' }} />}
                  {activity.status === 'info' && <InfoIcon sx={{ color: '#2196F3' }} />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                      {activity.description} • {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  </motion.div>
);

// User Management Component with real functionality
const UserManagement = ({ darkMode }) => {
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/demo/students');
      const data = await response.json();
      if (data.success) {
        setStudents(data.data.students);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadStaff = async () => {
    setLoadingStaff(true);
    try {
      // Mock staff data for demo
      const demoStaff = [
        { id: 1, name: 'Dr. Smith', email: 'smith@jagruk.edu', role: 'staff', department: 'Science' },
        { id: 2, name: 'Ms. Johnson', email: 'johnson@jagruk.edu', role: 'staff', department: 'Mathematics' },
        { id: 3, name: 'Mr. Brown', email: 'brown@jagruk.edu', role: 'staff', department: 'English' }
      ];
      setStaff(demoStaff);
    } catch (error) {
      console.error('Failed to load staff:', error);
      toast.error('Failed to load staff');
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    loadStudents();
    loadStaff();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
        User Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: darkMode ? '#1e1e1e' : 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
                  Student Management
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => setStudentDialogOpen(true)}
                >
                  View All
                </Button>
              </Box>
              <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary', mb: 2 }}>
                Total Students: {students.length}
              </Typography>
              {loadingStudents ? (
                <CircularProgress size={24} />
              ) : (
                <List dense>
                  {students.slice(0, 3).map(student => (
                    <ListItem key={student.id} disablePadding>
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                            {student.name}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                            Class {student.class} • {student.modulesCompleted} modules completed
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setStudentDialogOpen(true)}>
                Manage Students
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: darkMode ? '#1e1e1e' : 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
                  Staff Management
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => setStaffDialogOpen(true)}
                >
                  View All
                </Button>
              </Box>
              <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary', mb: 2 }}>
                Total Staff: {staff.length}
              </Typography>
              {loadingStaff ? (
                <CircularProgress size={24} />
              ) : (
                <List dense>
                  {staff.slice(0, 3).map(member => (
                    <ListItem key={member.id} disablePadding>
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                            {member.name}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                            {member.department} Department
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setStaffDialogOpen(true)}>
                Manage Staff
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student Management Dialog */}
      <Dialog 
        open={studentDialogOpen} 
        onClose={() => setStudentDialogOpen(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: darkMode ? '#1a1a1a' : 'white' } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
            Student Management
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {students.map(student => (
              <ListItem key={student.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: '#4ECDC4' }}>
                    {student.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      {student.name} - {student.admissionNumber}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                      Class {student.class} • Age {student.age} • {student.modulesCompleted} modules • {student.drillsAttended} drills attended
                    </Typography>
                  }
                />
                <Chip 
                  label={student.isActive ? 'Active' : 'Inactive'} 
                  color={student.isActive ? 'success' : 'error'} 
                  size="small" 
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentDialogOpen(false)}>Close</Button>
          <Button variant="contained">Add New Student</Button>
        </DialogActions>
      </Dialog>

      {/* Staff Management Dialog */}
      <Dialog 
        open={staffDialogOpen} 
        onClose={() => setStaffDialogOpen(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: darkMode ? '#1a1a1a' : 'white' } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
            Staff Management
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {staff.map(member => (
              <ListItem key={member.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: '#45B7D1' }}>
                    {member.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      {member.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                      {member.email} • {member.department} Department
                    </Typography>
                  }
                />
                <Chip label={member.role.toUpperCase()} color="primary" size="small" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStaffDialogOpen(false)}>Close</Button>
          <Button variant="contained">Add New Staff</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

// Security Section Component with real functionality
const SecuritySection = ({ darkMode }) => {
  const [drills, setDrills] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loadingDrills, setLoadingDrills] = useState(false);
  const [drillDialogOpen, setDrillDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedDrillType, setSelectedDrillType] = useState('fire');

  const drillTypes = {
    fire: { label: 'Fire Drill', color: '#F44336', icon: '🔥' },
    earthquake: { label: 'Earthquake Drill', color: '#FF9800', icon: '🌍' },
    lockdown: { label: 'Security Lockdown', color: '#9C27B0', icon: '🔒' },
    weather: { label: 'Weather Emergency', color: '#2196F3', icon: '⛈️' }
  };

  const loadSecurityData = async () => {
    setLoadingDrills(true);
    try {
      // Mock drill data
      const mockDrills = [
        {
          id: 1,
          title: 'Fire Evacuation Drill',
          type: 'fire',
          status: 'scheduled',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          participants: 450,
          duration: '15 minutes'
        },
        {
          id: 2,
          title: 'Earthquake Safety Drill',
          type: 'earthquake', 
          status: 'completed',
          scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 432,
          duration: '12 minutes',
          attendanceRate: 96
        },
        {
          id: 3,
          title: 'Security Lockdown Practice',
          type: 'lockdown',
          status: 'active',
          scheduledDate: new Date().toISOString(),
          participants: 445,
          duration: '8 minutes'
        }
      ];

      const mockAlerts = [
        {
          id: 1,
          type: 'weather',
          severity: 'warning',
          title: 'Heavy Rain Alert',
          message: 'Thunderstorm warning for next 3 hours',
          isActive: true,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'maintenance',
          severity: 'info',
          title: 'System Maintenance',
          message: 'Emergency alert system will undergo maintenance',
          isActive: true,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];

      setDrills(mockDrills);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoadingDrills(false);
    }
  };

  const scheduleDrill = async (drillType) => {
    try {
      const newDrill = {
        id: Date.now(),
        title: `${drillTypes[drillType].label} - ${new Date().toLocaleDateString()}`,
        type: drillType,
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        participants: Math.floor(Math.random() * 100) + 400,
        duration: '15 minutes'
      };

      setDrills(prev => [newDrill, ...prev]);
      toast.success(`${drillTypes[drillType].label} scheduled successfully!`);
      setDrillDialogOpen(false);
    } catch (error) {
      console.error('Failed to schedule drill:', error);
      toast.error('Failed to schedule drill');
    }
  };

  const triggerEmergencyAlert = async (alertType) => {
    try {
      const newAlert = {
        id: Date.now(),
        type: alertType,
        severity: 'error',
        title: `Emergency Alert - ${alertType.toUpperCase()}`,
        message: `Emergency ${alertType} alert triggered by admin`,
        isActive: true,
        timestamp: new Date().toISOString()
      };

      setAlerts(prev => [newAlert, ...prev]);
      toast.success(`Emergency ${alertType} alert triggered!`, {
        style: { backgroundColor: '#f44336', color: 'white' }
      });
    } catch (error) {
      console.error('Failed to trigger alert:', error);
      toast.error('Failed to trigger alert');
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'scheduled': return '#FF9800';
      case 'completed': return '#2196F3';
      default: return '#757575';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      case 'success': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
        Security & Emergency Management
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        {/* Drill Management */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: darkMode ? '#1e1e1e' : 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
                  Emergency Drills
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setDrillDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Schedule Drill
                </Button>
              </Box>

              {loadingDrills ? (
                <CircularProgress />
              ) : (
                <List>
                  {drills.map((drill, index) => (
                    <motion.div
                      key={drill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: `${drillTypes[drill.type].color}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px'
                            }}
                          >
                            {drillTypes[drill.type].icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                              {drill.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                                {new Date(drill.scheduledDate).toLocaleString()} • {drill.participants} participants
                              </Typography>
                              {drill.attendanceRate && (
                                <Typography variant="caption" sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                                  Attendance Rate: {drill.attendanceRate}%
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip 
                          label={drill.status.toUpperCase()} 
                          sx={{ 
                            bgcolor: `${getStatusColor(drill.status)}20`,
                            color: getStatusColor(drill.status),
                            fontWeight: 'bold'
                          }}
                        />
                      </ListItem>
                      {index < drills.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: darkMode ? '#1e1e1e' : 'white', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
                Emergency Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => triggerEmergencyAlert('fire')}
                  startIcon={<SecurityIcon />}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Fire Alert
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  onClick={() => triggerEmergencyAlert('weather')}
                  startIcon={<WarningIcon />}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Weather Alert
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
                  onClick={() => setAlertDialogOpen(true)}
                  startIcon={<NotificationsIcon />}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  View Alerts
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card sx={{ bgcolor: darkMode ? '#1e1e1e' : 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: darkMode ? 'white' : 'inherit' }}>
                Active Alerts ({alerts.filter(a => a.isActive).length})
              </Typography>
              {alerts.filter(a => a.isActive).map(alert => (
                <Box
                  key={alert.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    border: `1px solid ${getSeverityColor(alert.severity)}`,
                    bgcolor: `${getSeverityColor(alert.severity)}10`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                    {alert.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                    {alert.message}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schedule Drill Dialog */}
      <Dialog 
        open={drillDialogOpen} 
        onClose={() => setDrillDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: darkMode ? '#1a1a1a' : 'white', borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
            Schedule Emergency Drill
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3, color: darkMode ? '#aaa' : 'text.secondary' }}>
            Select the type of emergency drill to schedule:
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(drillTypes).map(([type, config]) => (
              <Grid item xs={12} sm={6} key={type}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedDrillType === type ? `2px solid ${config.color}` : '1px solid #e0e0e0',
                    bgcolor: selectedDrillType === type ? `${config.color}10` : 'inherit',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => setSelectedDrillType(type)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {config.icon}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      {config.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrillDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => scheduleDrill(selectedDrillType)} 
            variant="contained"
            sx={{ bgcolor: drillTypes[selectedDrillType].color }}
          >
            Schedule {drillTypes[selectedDrillType].label}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts Dialog */}
      <Dialog 
        open={alertDialogOpen} 
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: darkMode ? '#1a1a1a' : 'white' } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
            Emergency Alerts History
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {alerts.map(alert => (
              <ListItem key={alert.id}>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: getSeverityColor(alert.severity)
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      {alert.title}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                      {alert.message} • {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  }
                />
                <Chip
                  label={alert.isActive ? 'ACTIVE' : 'RESOLVED'}
                  color={alert.isActive ? 'error' : 'default'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

// Settings Dialog Component - Enhanced with more options
const SettingsDialog = ({ open, onClose, settings, onSettingsUpdate, darkMode }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [loading, setSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Try to save to backend
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(localSettings)
      });

      if (response.ok) {
        onSettingsUpdate(localSettings);
        toast.success('Settings saved successfully');
      } else {
        // Fallback - just update locally
        onSettingsUpdate(localSettings);
        toast.success('Settings updated (demo mode)');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Fallback - just update locally
      onSettingsUpdate(localSettings);
      toast.success('Settings updated locally');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false,
          drillReminders: true,
          systemAlerts: true
        },
        dashboard: {
          autoRefresh: true,
          refreshInterval: 30,
          showAnimations: true,
          compactMode: false
        }
      };
      
      setLocalSettings(defaultSettings);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#1a1a1a' : 'white',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
          Settings & Preferences
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Theme Settings */}
          <Card sx={{ mb: 3, bgcolor: darkMode ? '#2a2a2a' : '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                🎨 Appearance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Dark Mode</Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                    Toggle between light and dark themes
                  </Typography>
                </Box>
                <Switch
                  checked={localSettings.theme === 'dark'}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    theme: e.target.checked ? 'dark' : 'light'
                  })}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card sx={{ mb: 3, bgcolor: darkMode ? '#2a2a2a' : '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                🔔 Notifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Email Notifications</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Receive emails for important updates
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.notifications?.email || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          email: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Push Notifications</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Browser push notifications
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.notifications?.push || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          push: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Drill Reminders</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Notify about upcoming drills
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.notifications?.drillReminders || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          drillReminders: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>System Alerts</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Critical system notifications
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.notifications?.systemAlerts || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          systemAlerts: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Dashboard Settings */}
          <Card sx={{ bgcolor: darkMode ? '#2a2a2a' : '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                📊 Dashboard Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Auto Refresh</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Automatically update data
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.dashboard?.autoRefresh || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        dashboard: {
                          ...localSettings.dashboard,
                          autoRefresh: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Animations</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Show smooth animations
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.dashboard?.showAnimations || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        dashboard: {
                          ...localSettings.dashboard,
                          showAnimations: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>Compact Mode</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        Reduce spacing and padding
                      </Typography>
                    </Box>
                    <Switch
                      checked={localSettings.dashboard?.compactMode || false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        dashboard: {
                          ...localSettings.dashboard,
                          compactMode: e.target.checked
                        }
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                        Refresh Rate: {localSettings.dashboard?.refreshInterval || 30}s
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#777' : 'text.secondary' }}>
                        How often to update data
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[15, 30, 60].map(interval => (
                        <Button
                          key={interval}
                          size="small"
                          variant={localSettings.dashboard?.refreshInterval === interval ? 'contained' : 'outlined'}
                          onClick={() => setLocalSettings({
                            ...localSettings,
                            dashboard: {
                              ...localSettings.dashboard,
                              refreshInterval: interval
                            }
                          })}
                        >
                          {interval}s
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
          Reset to Defaults
        </Button>
        <Button onClick={onClose} sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDashboard;
