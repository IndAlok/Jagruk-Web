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
  TablePagination,
  Checkbox,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Menu as MenuIcon,
  ExitToApp,
  Person,
  AdminPanelSettings,
  Schedule,
  Assessment,
  TrendingUp,
  Search,
  FilterList,
  Download,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI, settingsAPI } from '../services/api';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Data states
  const [stats, setStats] = useState({
    totalStudents: 1245,
    totalStaff: 87,
    activeDrills: 3,
    systemHealth: 98,
    completedDrills: 245,
    pendingAlerts: 2
  });
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  
  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  
  // Form states
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    admissionNumber: '',
    class: '',
    age: '',
    parentContact: '',
    address: '',
    isActive: true
  });
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    dateOfJoining: '',
    isActive: true
  });
  
  // Table states
  const [studentPage, setStudentPage] = useState(0);
  const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Generate mock data
      setActivities([
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
      ]);

      setNotifications([
        {
          id: 1,
          type: 'info',
          title: 'System Update',
          message: 'New security features available',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false
        }
      ]);

      setStudents([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.j@student.jagruk.edu',
          admissionNumber: 'STU001',
          class: '10A',
          age: 16,
          parentContact: '+1234567890',
          address: '123 Main St, City',
          isActive: true
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob.s@student.jagruk.edu',
          admissionNumber: 'STU002',
          class: '10B',
          age: 15,
          parentContact: '+1234567892',
          address: '456 Oak Ave, City',
          isActive: true
        }
      ]);

      setStats(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
      
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
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Student management handlers
  const handleAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({
      name: '',
      email: '',
      admissionNumber: '',
      class: '',
      age: '',
      parentContact: '',
      address: '',
      isActive: true
    });
    setStudentDialogOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({ ...student });
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
        const newStudent = {
          ...studentForm,
          id: students.length + 1,
        };
        setStudents(prev => [...prev, newStudent]);
        showSnackbar('Student added successfully', 'success');
      }
      setStudentDialogOpen(false);
    } catch (error) {
      showSnackbar('Failed to save student', 'error');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        showSnackbar('Student deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete student', 'error');
      }
    }
  };

  // Table handlers
  const handleStudentPageChange = (event, newPage) => {
    setStudentPage(newPage);
  };

  const handleStudentRowsPerPageChange = (event) => {
    setStudentRowsPerPage(parseInt(event.target.value, 10));
    setStudentPage(0);
  };

  // Filter function
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && student.isActive) ||
                         (filterStatus === 'inactive' && !student.isActive);
    return matchesSearch && matchesFilter;
  });

  // Initialize dashboard
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser, loadDashboardData]);

  // Color scheme
  const colorScheme = darkMode ? {
    primary: '#90caf9',
    secondary: '#f48fb1', 
    background: '#121212',
    paper: '#1e1e1e',
    text: '#ffffff',
    accent: '#bb86fc'
  } : {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#f5f5f5',
    paper: '#ffffff',
    text: '#333333',
    accent: '#3f51b5'
  };

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
      case 'alerts':
        return <Typography variant="h5">Alerts Management - Coming Soon</Typography>;
      case 'settings':
        return <Typography variant="h5">Settings - Coming Soon</Typography>;
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {currentUser?.displayName || 'Admin'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening in your school today
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(45deg, ${colorScheme.primary}, ${colorScheme.accent})`, color: 'white' }}>
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
              {activities.map((activity, index) => (
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
        >
          Add Student
        </Button>
      </Box>
      
      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search students..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Students</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Admission No.</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(studentPage * studentRowsPerPage, studentPage * studentRowsPerPage + studentRowsPerPage)
                .map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: colorScheme.primary }}>
                          {student.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{student.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Age: {student.age}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.admissionNumber}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.parentContact}</TableCell>
                    <TableCell>
                      <Chip 
                        label={student.isActive ? 'Active' : 'Inactive'}
                        color={student.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditStudent(student)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteStudent(student.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={studentRowsPerPage}
          page={studentPage}
          onPageChange={handleStudentPageChange}
          onRowsPerPageChange={handleStudentRowsPerPageChange}
        />
      </Card>
    </motion.div>
  );

  // Loading screen
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
        <CircularProgress 
          size={60} 
          sx={{ 
            color: darkMode ? '#90caf9' : '#ffffff',
            mb: 2 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#ffffff',
            textAlign: 'center' 
          }}
        >
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  // Main render
  return (
    <ThemeProvider theme={createTheme({
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
    })}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: colorScheme.background,
        }}
      >
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Dark Mode</Typography>
              <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                size="small"
              />
            </Box>
          </Box>

          {/* Navigation Menu */}
          <List sx={{ py: 0 }}>
            {[
              { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
              { key: 'students', label: 'Student Management', icon: <PersonIcon /> },
              { key: 'staff', label: 'Staff Management', icon: <AdminIcon /> },
              { key: 'drills', label: 'Security Drills', icon: <ScheduleIcon /> },
              { key: 'analytics', label: 'Analytics', icon: <AssessmentIcon /> },
              { key: 'alerts', label: 'Alerts', icon: <NotificationsIcon /> },
              { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
            ].map((item) => (
              <ListItem
                key={item.key}
                button
                selected={activeSection === item.key}
                onClick={() => handleSidebarMenuClick(item.key)}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&.Mui-selected': {
                    bgcolor: `${colorScheme.primary}20`,
                    borderRight: `3px solid ${colorScheme.primary}`,
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
              <IconButton onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: colorScheme.primary }}>
                  {currentUser?.displayName?.[0]?.toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Box>
          </Paper>

          {/* Content */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: colorScheme.background }}>
            {renderContent()}
          </Box>
        </Box>

        {/* Menus */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <PersonIcon sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => { handleProfileMenuClose(); setActiveSection('settings'); }}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleProfileMenuClose(); logout(); }}>
            <ExitToApp sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationMenuClose}
        >
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                handleMarkAsRead(notification.id);
                handleNotificationMenuClose();
              }}
            >
              <Box>
                <Typography variant="subtitle2">{notification.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Student Dialog */}
        <Dialog 
          open={studentDialogOpen} 
          onClose={() => setStudentDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Admission Number"
                  value={studentForm.admissionNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, admissionNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Class"
                  value={studentForm.class}
                  onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={studentForm.age}
                  onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStudentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveStudent}
              variant="contained"
              disabled={!studentForm.name || !studentForm.email}
            >
              {editingStudent ? 'Update' : 'Add'} Student
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
