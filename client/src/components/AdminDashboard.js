import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  CircularProgress,
  Avatar,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Person,
  AdminPanelSettings,
  Schedule,
  Assessment,
  TrendingUp,
  Search,
  Download,
  Warning as AlertIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ProfileSidebar from './Common/ProfileSidebar';
import Profile from './Common/Profile';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  
  // Main state
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [showProfile, setShowProfile] = useState(false);
  
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
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Alert', message: 'New security drill scheduled', read: false, type: 'info' },
    { id: 2, title: 'Student Update', message: '5 new student registrations', read: false, type: 'success' },
    { id: 3, title: 'Staff Alert', message: 'Monthly report due tomorrow', read: true, type: 'warning' }
  ]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  
  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
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

  // Search and filter states  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [studentPage, setStudentPage] = useState(0);
  const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);

  // Drill management states
  const [drills, setDrills] = useState([]);
  const [drillDialogOpen, setDrillDialogOpen] = useState(false);
  const [drillForm, setDrillForm] = useState({
    title: '',
    type: 'fire',
    scheduledDate: '',
    scheduledTime: '',
    description: '',
    isActive: true
  });

  // Emergency alert states
  const [alerts, setAlerts] = useState([]);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    severity: 'warning',
    targetAudience: 'all',
    expiresAt: '',
    isActive: true
  });

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

      setStaff([
        {
          id: 1,
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@jagruk.edu',
          department: 'Mathematics',
          position: 'Head of Department',
          phone: '+1234567893',
          dateOfJoining: '2020-08-15',
          isActive: true
        },
        {
          id: 2,
          name: 'John Mitchell',
          email: 'john.mitchell@jagruk.edu',
          department: 'Security',
          position: 'Security Officer',
          phone: '+1234567894',
          dateOfJoining: '2021-03-10',
          isActive: true
        }
      ]);

      setDrills([
        {
          id: 1,
          title: 'Monthly Fire Drill',
          type: 'fire',
          scheduledDate: '2025-09-25',
          scheduledTime: '10:00',
          description: 'Routine monthly fire evacuation drill',
          status: 'scheduled',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Earthquake Preparedness',
          type: 'earthquake',
          scheduledDate: '2025-10-01',
          scheduledTime: '14:30',
          description: 'Earthquake response and safety drill',
          status: 'scheduled',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]);

      setAlerts([
        {
          id: 1,
          title: 'System Maintenance',
          message: 'Scheduled system maintenance on Sunday 2:00 AM - 4:00 AM',
          severity: 'info',
          targetAudience: 'all',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: 2,
          title: 'Emergency Drill Today',
          message: 'Fire drill scheduled at 10:00 AM today. All students and staff must participate.',
          severity: 'warning',
          targetAudience: 'all',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
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
    if (section === 'profile') {
      setShowProfile(true);
      setSidebarOpen(false);
    } else {
      setShowProfile(false);
      setActiveSection(section);
      setSidebarOpen(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfile = () => {
    setShowProfile(true);
    setSidebarOpen(false);
    handleProfileMenuClose();
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Staff management handlers
  const handleAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      name: '',
      email: '',
      department: '',
      position: '',
      phone: '',
      dateOfJoining: '',
      isActive: true
    });
    setStaffDialogOpen(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setStaffForm({ ...staffMember });
    setStaffDialogOpen(true);
  };

  const handleSaveStaff = async () => {
    try {
      if (editingStaff) {
        setStaff(prev => prev.map(s => 
          s.id === editingStaff.id ? { ...staffForm, id: editingStaff.id } : s
        ));
        showSnackbar('Staff member updated successfully', 'success');
      } else {
        const newStaff = {
          ...staffForm,
          id: staff.length + 1,
        };
        setStaff(prev => [...prev, newStaff]);
        showSnackbar('Staff member added successfully', 'success');
      }
      setStaffDialogOpen(false);
    } catch (error) {
      showSnackbar('Failed to save staff member', 'error');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setStaff(prev => prev.filter(s => s.id !== staffId));
        showSnackbar('Staff member deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete staff member', 'error');
      }
    }
  };

  // Drill management handlers
  const handleScheduleDrill = () => {
    setDrillForm({
      title: '',
      type: 'fire',
      scheduledDate: '',
      scheduledTime: '',
      description: '',
      isActive: true
    });
    setDrillDialogOpen(true);
  };

  const handleSaveDrill = async () => {
    try {
      const newDrill = {
        ...drillForm,
        id: drills.length + 1,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      setDrills(prev => [...prev, newDrill]);
      showSnackbar('Drill scheduled successfully', 'success');
      setDrillDialogOpen(false);
    } catch (error) {
      showSnackbar('Failed to schedule drill', 'error');
    }
  };

  const handleDeleteDrill = async (drillId) => {
    if (window.confirm('Are you sure you want to delete this drill?')) {
      try {
        setDrills(prev => prev.filter(d => d.id !== drillId));
        showSnackbar('Drill deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete drill', 'error');
      }
    }
  };

  // Emergency alert handlers
  const handleCreateAlert = () => {
    setAlertForm({
      title: '',
      message: '',
      severity: 'warning',
      targetAudience: 'all',
      expiresAt: '',
      isActive: true
    });
    setAlertDialogOpen(true);
  };

  const handleSaveAlert = async () => {
    try {
      if (!alertForm.title.trim() || !alertForm.message.trim()) {
        showSnackbar('Title and message are required', 'error');
        return;
      }

      const newAlert = {
        ...alertForm,
        id: alerts.length + 1,
        createdAt: new Date().toISOString(),
        expiresAt: alertForm.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      showSnackbar('Emergency alert created successfully', 'success');
      setAlertDialogOpen(false);
      
      // Trigger browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(`JAGRUK ALERT: ${alertForm.title}`, {
          body: alertForm.message,
          icon: '/favicon.ico'
        });
      }
      
    } catch (error) {
      showSnackbar('Failed to create alert', 'error');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        showSnackbar('Alert deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete alert', 'error');
      }
    }
  };

  const handleToggleAlert = async (alertId) => {
    try {
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, isActive: !a.isActive } : a
      ));
      showSnackbar('Alert status updated', 'success');
    } catch (error) {
      showSnackbar('Failed to update alert status', 'error');
    }
  };
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
    if (showProfile) {
      return (
        <Profile
          user={currentUser}
          onClose={() => setShowProfile(false)}
          onBack={() => setShowProfile(false)}
        />
      );
    }

    switch (activeSection) {
      case 'students':
        return renderStudentManagement();
      case 'staff':
        return renderStaffManagement();
      case 'users':
        return renderUserManagement();
      case 'security':
        return renderSecurity();
      case 'drills':
        return renderDrillManagement();
      case 'analytics':
        return renderAnalytics();
      case 'alerts':
        return renderAlertsManagement();
      case 'settings':
        return renderSettings();
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
      {/* Profile Completion Alert for Demo Users */}
      {currentUser?.isDemo && (!currentUser?.isProfileComplete) && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setShowProfile(true)}
            >
              Complete Profile
            </Button>
          }
        >
          Welcome! Please complete your profile to get started. Some features may be limited until your profile is complete.
        </Alert>
      )}
      
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
                    onClick={handleAddStaff}
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
                    onClick={handleScheduleDrill}
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
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AlertIcon />}
                    onClick={handleCreateAlert}
                    color="error"
                    sx={{ mb: 2, height: 60 }}
                  >
                    Emergency Alert
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AlertIcon />}
                    onClick={() => setActiveSection('alerts')}
                    sx={{ mb: 2, height: 60 }}
                  >
                    Manage Alerts
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

  // Staff management
  const renderStaffManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStaff}
        >
          Add Staff Member
        </Button>
      </Box>
      
      {/* Staff Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Staff
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                {staff.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active staff members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Departments
              </Typography>
              <Typography variant="h3" color="secondary" sx={{ mb: 1 }}>
                {[...new Set(staff.map(s => s.department))].length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Different departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Staff
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                {staff.filter(s => s.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Staff Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Staff Directory
          </Typography>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: colorScheme.secondary }}>
                        {staffMember.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{staffMember.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Joined: {new Date(staffMember.dateOfJoining).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{staffMember.department}</TableCell>
                  <TableCell>{staffMember.position}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.phone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={staffMember.isActive ? 'Active' : 'Inactive'}
                      color={staffMember.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditStaff(staffMember)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteStaff(staffMember.id)}>
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

  // User management (combines students and staff)
  const renderUserManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Student Management" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddStudent}
                >
                  Add Student
                </Button>
              }
            />
            <CardContent>
              <Typography variant="h3" color="primary" gutterBottom>
                {students.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Students Registered
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Recent Students:
                </Typography>
                {students.slice(0, 3).map((student) => (
                  <Box key={student.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                      {student.name[0]}
                    </Avatar>
                    <Typography variant="body2">
                      {student.name} - {student.class}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button 
                variant="text" 
                onClick={() => setActiveSection('students')}
                sx={{ mt: 1 }}
              >
                View All Students
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Staff Management" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddStaff}
                >
                  Add Staff
                </Button>
              }
            />
            <CardContent>
              <Typography variant="h3" color="secondary" gutterBottom>
                {staff.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Staff Members
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Staff by Department:
                </Typography>
                {[...new Set(staff.map(s => s.department))].map((dept) => (
                  <Box key={dept} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{dept}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {staff.filter(s => s.department === dept).length}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button 
                variant="text" 
                onClick={() => setActiveSection('staff')}
                sx={{ mt: 1 }}
              >
                View All Staff
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Combined Recent Activities */}
      <Card>
        <CardHeader title="Recent User Activities" />
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <AddIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="New student registered"
                secondary={`${students[0]?.name} was added to class ${students[0]?.class}`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EditIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Staff profile updated"
                secondary={`${staff[0]?.name} updated their department information`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="User permissions updated"
                secondary="3 users had their access permissions modified"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Drill management
  const renderDrillManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Emergency Drill Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleScheduleDrill}
        >
          Schedule Drill
        </Button>
      </Box>
      
      {/* Drill Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fire Drills
              </Typography>
              <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                {drills.filter(d => d.type === 'fire').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Earthquake Drills
              </Typography>
              <Typography variant="h3" color="warning.main" sx={{ mb: 1 }}>
                {drills.filter(d => d.type === 'earthquake').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lockdown Drills
              </Typography>
              <Typography variant="h3" color="info.main" sx={{ mb: 1 }}>
                {drills.filter(d => d.type === 'lockdown').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Drills
              </Typography>
              <Typography variant="h3" color="primary.main" sx={{ mb: 1 }}>
                {drills.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All scheduled drills
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scheduled Drills Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Scheduled Drills
          </Typography>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drills.map((drill) => (
                <TableRow key={drill.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{drill.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {drill.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={drill.type.charAt(0).toUpperCase() + drill.type.slice(1)}
                      color={
                        drill.type === 'fire' ? 'error' :
                        drill.type === 'earthquake' ? 'warning' :
                        drill.type === 'lockdown' ? 'info' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(drill.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>{drill.scheduledTime}</TableCell>
                  <TableCell>
                    <Chip 
                      label={drill.status}
                      color={drill.status === 'scheduled' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => showSnackbar('Drill edit feature coming soon', 'info')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDrill(drill.id)}>
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

  // Security section
  const renderSecurity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Security Management
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Status
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                SECURE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All systems operational
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={98} 
                color="success"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Alerts
              </Typography>
              <Typography variant="h3" color="warning.main" sx={{ mb: 1 }}>
                {stats.pendingAlerts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emergency Drills
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                {drills.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Security Features */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Emergency Response" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Schedule Emergency Drill"
                    secondary="Plan and execute safety drills"
                  />
                  <Button 
                    variant="outlined"
                    onClick={handleScheduleDrill}
                  >
                    Schedule
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Assessment color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="View Analytics"
                    secondary="Monitor drill performance metrics"
                  />
                  <Button 
                    variant="outlined"
                    onClick={() => setActiveSection('analytics')}
                  >
                    View
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AlertIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Emergency Alerts"
                    secondary="Manage critical notifications"
                  />
                  <Button 
                    variant="outlined"
                    onClick={() => setActiveSection('alerts')}
                  >
                    Manage
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Security Settings" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Access Control"
                    secondary="Manage user permissions and roles"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Emergency Notifications"
                    secondary="Real-time alert system"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Drill Reminders"
                    secondary="Automatic drill scheduling"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Performance Tracking"
                    secondary="Monitor evacuation metrics"
                  />
                  <Switch defaultChecked />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Analytics
  const renderAnalytics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics & Reports
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => showSnackbar('Generating report...', 'info')}
        >
          Export Report
        </Button>
      </Box>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Participation
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                94.5%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average drill participation
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={94.5} 
                color="success"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Response Time
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                2.3min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average evacuation time
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                ↓ 15% improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Safety Score
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                A+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall safety rating
              </Typography>
              <Chip 
                label="Excellent" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Rate
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                98.2%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Safety protocol adherence
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={98.2} 
                color="primary"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Drill Performance Trends" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monthly performance metrics for emergency drills
              </Typography>
              
              {/* Mock chart data */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Fire Drills - Response Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    Jan: 2.8min
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ flexGrow: 1, ml: 2 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    Feb: 2.5min
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={90} 
                    sx={{ flexGrow: 1, ml: 2 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    Mar: 2.3min
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={95} 
                    sx={{ flexGrow: 1, ml: 2 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Department Participation" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Participation rates by department
              </Typography>
              
              {/* Department statistics */}
              <Box>
                {[
                  { name: 'Administration', rate: 100 },
                  { name: 'Teaching Staff', rate: 98 },
                  { name: 'Support Staff', rate: 95 },
                  { name: 'Security', rate: 100 },
                  { name: 'Maintenance', rate: 92 }
                ].map((dept) => (
                  <Box key={dept.name} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{dept.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dept.rate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={dept.rate}
                      color={dept.rate >= 95 ? 'success' : dept.rate >= 90 ? 'warning' : 'error'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Recent Activity Summary" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats.completedDrills}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Drills Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {students.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Students Enrolled
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      {staff.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Staff Members
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Alerts management
  const renderAlertsManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Emergency Alert Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAlert}
          color="error"
        >
          Create Emergency Alert
        </Button>
      </Box>
      
      {/* Alert Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Alerts
              </Typography>
              <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                {alerts.filter(a => a.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently active system alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Critical Alerts
              </Typography>
              <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                {alerts.filter(a => a.severity === 'error' && a.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical level alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Warning Alerts
              </Typography>
              <Typography variant="h3" color="warning.main" sx={{ mb: 1 }}>
                {alerts.filter(a => a.severity === 'warning' && a.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Warning level alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Sent
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                {alerts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total alerts sent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts Table */}
      <Card>
        <CardHeader 
          title="Emergency Alerts" 
          action={
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => showSnackbar('Alerts refreshed', 'success')}
            >
              Refresh
            </Button>
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Alert</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {alert.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {alert.message}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={alert.severity.toUpperCase()}
                      color={
                        alert.severity === 'error' ? 'error' :
                        alert.severity === 'warning' ? 'warning' :
                        alert.severity === 'success' ? 'success' : 'info'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {alert.targetAudience === 'all' ? 'All Users' : 
                       alert.targetAudience === 'students' ? 'Students Only' : 
                       'Staff Only'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(alert.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(alert.expiresAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={alert.isActive}
                      onChange={() => handleToggleAlert(alert.id)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleDeleteAlert(alert.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No alerts created yet. Create your first emergency alert.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </motion.div>
  );

  // Settings
  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Dark Mode</Typography>
                <Switch
                  checked={darkMode}
                  onChange={handleThemeToggle}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Configure system-wide preferences and display options.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage notification preferences and alert configurations.
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => showSnackbar('Notification settings will be implemented', 'info')}
              >
                Configure Notifications
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                System Health: {stats.systemHealth}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date().toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
        onSettings={() => { setActiveSection('settings'); setShowProfile(false); }}
        onProfile={handleProfile}
        onThemeToggle={handleThemeToggle}
        darkMode={darkMode}
        user={currentUser}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
      />

      {/* Main Content */}
      <Box sx={{ p: 3, pt: 10 }}>
        {renderContent()}
      </Box>

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

      {/* Staff Dialog */}
      <Dialog 
        open={staffDialogOpen} 
        onClose={() => setStaffDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={staffForm.department}
                onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position"
                value={staffForm.position}
                onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Joining"
                type="date"
                value={staffForm.dateOfJoining}
                onChange={(e) => setStaffForm({ ...staffForm, dateOfJoining: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={staffForm.isActive}
                    onChange={(e) => setStaffForm({ ...staffForm, isActive: e.target.checked })}
                  />
                }
                label="Active Staff Member"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStaffDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveStaff}
            variant="contained"
            disabled={!staffForm.name || !staffForm.email}
          >
            {editingStaff ? 'Update' : 'Add'} Staff Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drill Dialog */}
      <Dialog 
        open={drillDialogOpen} 
        onClose={() => setDrillDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Schedule New Emergency Drill
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Drill Title"
                value={drillForm.title}
                onChange={(e) => setDrillForm({ ...drillForm, title: e.target.value })}
                placeholder="e.g., Monthly Fire Drill"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Drill Type</InputLabel>
                <Select
                  value={drillForm.type}
                  onChange={(e) => setDrillForm({ ...drillForm, type: e.target.value })}
                  label="Drill Type"
                >
                  <MenuItem value="fire">Fire Drill</MenuItem>
                  <MenuItem value="earthquake">Earthquake Drill</MenuItem>
                  <MenuItem value="lockdown">Lockdown Drill</MenuItem>
                  <MenuItem value="evacuation">General Evacuation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scheduled Date"
                type="date"
                value={drillForm.scheduledDate}
                onChange={(e) => setDrillForm({ ...drillForm, scheduledDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scheduled Time"
                type="time"
                value={drillForm.scheduledTime}
                onChange={(e) => setDrillForm({ ...drillForm, scheduledTime: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={drillForm.description}
                onChange={(e) => setDrillForm({ ...drillForm, description: e.target.value })}
                placeholder="Describe the purpose and scope of this drill..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrillDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDrill}
            variant="contained"
            disabled={!drillForm.title || !drillForm.scheduledDate || !drillForm.scheduledTime}
          >
            Schedule Drill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Emergency Alert Dialog */}
      <Dialog 
        open={alertDialogOpen} 
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Create Emergency Alert
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Title"
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Message"
                multiline
                rows={4}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                required
                helperText="Provide clear, actionable information for recipients"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Severity Level</InputLabel>
                <Select
                  value={alertForm.severity}
                  onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                  label="Severity Level"
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Critical</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={alertForm.targetAudience}
                  onChange={(e) => setAlertForm({ ...alertForm, targetAudience: e.target.value })}
                  label="Target Audience"
                >
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="students">Students Only</MenuItem>
                  <MenuItem value="staff">Staff Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expires At"
                type="datetime-local"
                value={alertForm.expiresAt}
                onChange={(e) => setAlertForm({ ...alertForm, expiresAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="Leave empty to set default 24-hour expiration"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alertForm.isActive}
                    onChange={(e) => setAlertForm({ ...alertForm, isActive: e.target.checked })}
                  />
                }
                label="Activate immediately"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAlert} 
            variant="contained" 
            color="error"
            startIcon={<AlertIcon />}
          >
            Send Alert
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
  );
};

export default AdminDashboard;
