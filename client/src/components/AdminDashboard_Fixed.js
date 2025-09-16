import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Avatar,
  Chip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Menu,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Switch,
  Slider,
  FormGroup,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person,
  Group,
  Assessment,
  Schedule,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExitToApp,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning,
  Info,
  CheckCircle,
  Error,
  Close,
  Email,
  Security,
  Palette,
  Language,
  VolumeUp,
  Brightness4,
  Brightness7,
  TrendingUp,
  Search,
  AdminPanelSettings,
  Visibility,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Dialog states
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  
  // Tab states
  const [settingsTab, setSettingsTab] = useState(0);
  const [notificationsTab, setNotificationsTab] = useState(0);
  const [alertsTab, setAlertsTab] = useState(0);
  
  // Data states
  const [stats, setStats] = useState({
    totalStudents: 1245,
    totalStaff: 87,
    activeDrills: 3,
    systemHealth: 98,
  });
  
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Settings state
  const [userSettings, setUserSettings] = useState({
    theme: { darkMode: false, primaryColor: 'blue', animations: true },
    notifications: {
      email: { enabled: true, alerts: true, digest: true },
      push: { enabled: true, urgent: true },
      sound: { volume: 50 }
    },
    dashboard: { autoRefresh: true, language: 'en', timezone: 'UTC' },
    privacy: { dataCollection: true, crashReports: true, locationTracking: false }
  });

  // Student form
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', admissionNumber: '', class: '', age: '', 
    parentContact: '', address: '', isActive: true
  });

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock data
      setActivities([
        {
          id: 1,
          title: 'Fire Evacuation Drill Completed',
          description: 'All 1,245 students evacuated successfully in 3:47 minutes',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: 2,
          title: 'New Student Registration',
          description: 'Alice Johnson registered for Grade 10A',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'info'
        }
      ]);

      setNotifications([
        {
          id: 1,
          type: 'info',
          title: 'System Update Available',
          message: 'New security features and performance improvements are ready',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium'
        }
      ]);

      setAlerts([
        {
          id: 1,
          type: 'weather',
          severity: 'warning',
          title: 'Thunderstorm Warning',
          description: 'Severe thunderstorm expected between 2-5 PM',
          isActive: true,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          affectedUsers: 1332,
          location: 'Campus Wide',
          actions: ['Cancel outdoor classes', 'Move activities indoors'],
          progress: 65,
          status: 'active'
        }
      ]);

      setStudents([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.j@student.jagruk.edu',
          admissionNumber: 'STU2024001',
          class: '10A',
          age: 16,
          parentContact: '+1 (555) 123-4567',
          address: '123 Maple Street, Springfield, IL 62701',
          isActive: true
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob.s@student.jagruk.edu',
          admissionNumber: 'STU2024002',
          class: '10B',
          age: 15,
          parentContact: '+1 (555) 234-5678',
          address: '456 Oak Avenue, Springfield, IL 62702',
          isActive: true
        }
      ]);
      
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      showSnackbar('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility functions
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Navigation handlers
  const handleSidebarMenuClick = (section) => {
    if (section === 'notifications') {
      setNotificationsDialogOpen(true);
    } else if (section === 'alerts') {
      setAlertsDialogOpen(true);
    } else if (section === 'settings') {
      setSettingsDialogOpen(true);
    } else {
      setActiveSection(section);
    }
    setSidebarOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({
      name: '', email: '', admissionNumber: '', class: '', age: '', 
      parentContact: '', address: '', isActive: true
    });
    setStudentDialogOpen(true);
  };

  const handleSaveStudent = async () => {
    try {
      if (editingStudent) {
        setStudents(prev => prev.map(s => 
          s.id === editingStudent.id ? { ...studentForm, id: editingStudent.id } : s
        ));
        showSnackbar('Student updated successfully', 'success');
      } else {
        const newStudent = { ...studentForm, id: students.length + 1 };
        setStudents(prev => [...prev, newStudent]);
        showSnackbar('Student added successfully', 'success');
      }
      setStudentDialogOpen(false);
    } catch (error) {
      showSnackbar('Failed to save student', 'error');
    }
  };

  // Initialize dashboard
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser, loadDashboardData]);

  // Color scheme
  const colorScheme = {
    primary: darkMode ? '#90caf9' : '#1976d2',
    secondary: darkMode ? '#f48fb1' : '#dc004e', 
    background: darkMode ? '#121212' : '#fafafa',
    paper: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#1a1a1a',
  };

  // Theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: colorScheme.primary },
      secondary: { main: colorScheme.secondary },
      background: {
        default: colorScheme.background,
        paper: colorScheme.paper,
      },
      text: { primary: colorScheme.text },
    },
    shape: { borderRadius: 12 },
  });

  // Sidebar menu items
  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'students', label: 'Students', icon: <Person /> },
    { id: 'staff', label: 'Staff', icon: <Group /> },
    { id: 'drills', label: 'Emergency Drills', icon: <Schedule /> },
    { id: 'analytics', label: 'Analytics', icon: <Assessment /> },
    { id: 'alerts', label: 'Alerts', icon: <Warning /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return renderStudentManagement();
      case 'staff':
        return <Typography variant="h5">Staff Management - Coming Soon</Typography>;
      case 'drills':
        return <Typography variant="h5">Drill Management - Coming Soon</Typography>;
      case 'analytics':
        return <Typography variant="h5">Analytics - Coming Soon</Typography>;
      case 'dashboard':
      default:
        return renderDashboardOverview();
    }
  };

  // Dashboard overview
  const renderDashboardOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {currentUser?.displayName || 'Admin'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening in your school today
          </Typography>
        </Box>
        <Button variant="outlined" onClick={loadDashboardData} disabled={loading}>
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(45deg, ${colorScheme.primary}, #3f51b5)`, color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats.totalStudents?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Students
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(45deg, ${colorScheme.secondary}, #ff6b6b)`, color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats.totalStaff?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Staff Members
                  </Typography>
                </Box>
                <AdminPanelSettings sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #4caf50, #8bc34a)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats.activeDrills || '0'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Drills
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #ff9800, #ffc107)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats.systemHealth || '0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    System Health
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activities and Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardHeader title="Recent Activities" />
            <CardContent sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
              {activities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: activity.status === 'success' ? 'success.main' : 'info.main',
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">{activity.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddStudent}
                    sx={{ mb: 2, height: 60 }}
                  >
                    Add Student
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mb: 2, height: 60 }}
                  >
                    Add Staff
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Schedule />}
                    onClick={() => setActiveSection('drills')}
                    sx={{ mb: 2, height: 60 }}
                  >
                    Schedule Drill
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => setActiveSection('analytics')}
                    sx={{ mb: 2, height: 60 }}
                  >
                    View Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Student management
  const renderStudentManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Student Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddStudent}>
          Add Student
        </Button>
      </Box>
      
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Admission No.</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: colorScheme.primary }}>
                        {student.name[0]}
                      </Avatar>
                      <Typography variant="subtitle2">{student.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{student.admissionNumber}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.isActive ? 'Active' : 'Inactive'}
                      color={student.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </motion.div>
  );

  // Loading screen
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: colorScheme.background,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Main render
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: colorScheme.background }}>
        {/* Sidebar */}
        <Paper
          sx={{
            width: 280,
            flexShrink: 0,
            bgcolor: colorScheme.paper,
            borderRight: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
            display: { xs: sidebarOpen ? 'block' : 'none', md: 'block' },
            position: { xs: 'fixed', md: 'relative' },
            height: '100vh',
            zIndex: 1200,
          }}
        >
          {/* User Profile */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 48, height: 48, mr: 2, bgcolor: colorScheme.primary }}
              >
                {currentUser?.displayName?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentUser?.displayName || 'Admin'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <List sx={{ p: 1 }}>
            {sidebarMenuItems.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => handleSidebarMenuClick(item.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: activeSection === item.id ? 'rgba(25,118,210,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(25,118,210,0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: colorScheme.paper,
              borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {activeSection === 'dashboard' ? 'Admin Dashboard' : activeSection.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Alerts Button */}
              <IconButton 
                onClick={() => setAlertsDialogOpen(true)}
                title="Emergency Alerts"
              >
                <Badge 
                  badgeContent={alerts.filter(a => a.isActive).length} 
                  color="error"
                  invisible={alerts.filter(a => a.isActive).length === 0}
                >
                  <Warning />
                </Badge>
              </IconButton>

              {/* Notifications Button */}
              <IconButton 
                onClick={() => setNotificationsDialogOpen(true)}
                title="Notifications"
              >
                <Badge 
                  badgeContent={notifications.filter(n => !n.read).length} 
                  color="primary"
                  invisible={notifications.filter(n => !n.read).length === 0}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Settings Button */}
              <IconButton onClick={() => setSettingsDialogOpen(true)} title="Settings">
                <SettingsIcon />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton onClick={handleThemeToggle} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {/* Profile Menu */}
              <IconButton onClick={handleProfileMenuOpen} title="Profile Menu">
                <Person />
              </IconButton>
            </Box>
          </Paper>

          {/* Content Area */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: colorScheme.background }}>
            {renderContent()}
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <Person sx={{ mr: 2 }} />
            Profile Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleProfileMenuClose(); logout(); }}>
            <ExitToApp sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Student Dialog */}
        <Dialog open={studentDialogOpen} onClose={() => setStudentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Admission Number"
                    value={studentForm.admissionNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, admissionNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Class"
                    value={studentForm.class}
                    onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={studentForm.age}
                    onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Parent Contact"
                    value={studentForm.parentContact}
                    onChange={(e) => setStudentForm({ ...studentForm, parentContact: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={studentForm.address}
                    onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={studentForm.isActive}
                        onChange={(e) => setStudentForm({ ...studentForm, isActive: e.target.checked })}
                      />
                    }
                    label="Active Student"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStudentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStudent} variant="contained" disabled={!studentForm.name || !studentForm.email}>
              {editingStudent ? 'Update' : 'Add'} Student
            </Button>
          </DialogActions>
        </Dialog>

        {/* Settings Dialog (Basic) */}
        <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>Theme Settings</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleThemeToggle}
                  />
                }
                label="Dark Mode"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Notifications Dialog (Basic) */}
        <Dialog open={notificationsDialogOpen} onClose={() => setNotificationsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Notifications</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              {notifications.map((notification) => (
                <Box key={notification.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                  <Typography variant="h6">{notification.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{notification.message}</Typography>
                  <Typography variant="caption">{new Date(notification.timestamp).toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotificationsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Alerts Dialog (Basic) */}
        <Dialog open={alertsDialogOpen} onClose={() => setAlertsDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Emergency Alerts</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              {alerts.map((alert) => (
                <Card key={alert.id} sx={{ mb: 2, border: '2px solid', borderColor: 'error.main' }}>
                  <CardContent>
                    <Typography variant="h6">{alert.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {alert.description}
                    </Typography>
                    <Typography variant="body2">Location: {alert.location}</Typography>
                    <Typography variant="body2">Affected Users: {alert.affectedUsers}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAlertsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
