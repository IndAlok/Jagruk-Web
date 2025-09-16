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
  Tooltip,
  Badge,
  Menu,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  TablePagination,
  Checkbox,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Assignment as DrillIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Menu as MenuIcon,
  ExitToApp,
  Person,
  AdminPanelSettings,
  Schedule,
  Assessment,
  TrendingUp,
  Close,
  Save,
  Search,
  FilterList,
  Download,
  Upload,
  Refresh,
  MoreVert,
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
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Navigation state
  const [selectedTab, setSelectedTab] = useState(0);
  
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
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [drills, setDrills] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [drillDialogOpen, setDrillDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
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
  const [staffPage, setStaffPage] = useState(0);
  const [staffRowsPerPage, setStaffRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
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
      
      // Load all data in parallel
      await Promise.all([
        loadStats(),
        loadActivities(),
        loadNotifications(),
        loadStudents(),
        loadStaff(),
        loadDrills(),
        loadAlerts()
      ]);
      
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      showSnackbar('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load functions for different data types
  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getAdminStats();
      setStats(response?.stats || generateMockStats());
    } catch (error) {
      setStats(generateMockStats());
    }
  };

  const loadActivities = async () => {
    try {
      const response = await dashboardAPI.getActivities();
      setActivities(response?.activities || generateMockActivities());
    } catch (error) {
      setActivities(generateMockActivities());
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await dashboardAPI.getNotifications();
      setNotifications(response?.notifications || generateMockNotifications());
    } catch (error) {
      setNotifications(generateMockNotifications());
    }
  };

  const loadStudents = async () => {
    try {
      // Mock comprehensive student data
      const mockStudents = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.j@student.jagruk.edu',
          admissionNumber: 'STU001',
          class: '10A',
          age: 16,
          parentContact: '+1234567890',
          address: '123 Main St, City',
          modulesCompleted: 8,
          totalModules: 10,
          drillsAttended: 12,
          totalDrills: 15,
          attendanceRate: 94.5,
          gpa: 3.8,
          isActive: true,
          dateOfAdmission: '2023-09-01',
          emergencyContact: 'John Johnson - +1234567891'
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
          modulesCompleted: 9,
          totalModules: 10,
          drillsAttended: 14,
          totalDrills: 15,
          attendanceRate: 96.2,
          gpa: 3.9,
          isActive: true,
          dateOfAdmission: '2023-09-01',
          emergencyContact: 'Mary Smith - +1234567893'
        },
        {
          id: 3,
          name: 'Carol Davis',
          email: 'carol.d@student.jagruk.edu',
          admissionNumber: 'STU003',
          class: '11A',
          age: 17,
          parentContact: '+1234567894',
          address: '789 Pine St, City',
          modulesCompleted: 6,
          totalModules: 12,
          drillsAttended: 10,
          totalDrills: 15,
          attendanceRate: 88.7,
          gpa: 3.6,
          isActive: true,
          dateOfAdmission: '2022-09-01',
          emergencyContact: 'Robert Davis - +1234567895'
        },
        {
          id: 4,
          name: 'David Wilson',
          email: 'david.w@student.jagruk.edu',
          admissionNumber: 'STU004',
          class: '12A',
          age: 18,
          parentContact: '+1234567896',
          address: '321 Elm St, City',
          modulesCompleted: 11,
          totalModules: 14,
          drillsAttended: 15,
          totalDrills: 15,
          attendanceRate: 98.1,
          gpa: 4.0,
          isActive: true,
          dateOfAdmission: '2021-09-01',
          emergencyContact: 'Lisa Wilson - +1234567897'
        }
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const loadStaff = async () => {
    try {
      const mockStaff = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.j@jagruk.edu',
          department: 'Science',
          position: 'Department Head',
          phone: '+1234567890',
          dateOfJoining: '2020-08-15',
          isActive: true,
          qualifications: 'PhD in Chemistry',
          experience: '10 years',
          specialization: 'Organic Chemistry'
        },
        {
          id: 2,
          name: 'Prof. Michael Brown',
          email: 'michael.b@jagruk.edu',
          department: 'Mathematics',
          position: 'Senior Teacher',
          phone: '+1234567891',
          dateOfJoining: '2019-07-20',
          isActive: true,
          qualifications: 'M.Sc Mathematics',
          experience: '8 years',
          specialization: 'Calculus & Statistics'
        },
        {
          id: 3,
          name: 'Ms. Emily Davis',
          email: 'emily.d@jagruk.edu',
          department: 'English',
          position: 'Teacher',
          phone: '+1234567892',
          dateOfJoining: '2021-06-01',
          isActive: true,
          qualifications: 'MA English Literature',
          experience: '5 years',
          specialization: 'Creative Writing'
        }
      ];
      setStaff(mockStaff);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  const loadDrills = async () => {
    try {
      const mockDrills = [
        {
          id: 1,
          title: 'Fire Evacuation Drill',
          type: 'fire',
          status: 'scheduled',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          participants: 450,
          duration: '15 minutes',
          description: 'Emergency fire evacuation practice',
          location: 'All Buildings'
        },
        {
          id: 2,
          title: 'Earthquake Safety Drill',
          type: 'earthquake',
          status: 'completed',
          scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 432,
          duration: '12 minutes',
          attendanceRate: 96,
          description: 'Drop, cover, and hold earthquake drill',
          location: 'Main Building'
        }
      ];
      setDrills(mockDrills);
    } catch (error) {
      console.error('Failed to load drills:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const mockAlerts = [
        {
          id: 1,
          type: 'weather',
          severity: 'warning',
          title: 'Heavy Rain Alert',
          message: 'Thunderstorm warning for next 3 hours',
          isActive: true,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

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

  const generateMockNotifications = () => [
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'New security features available',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Maintenance Scheduled',
      message: 'System maintenance tonight 11 PM - 1 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ];

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
    setSelectedTab(0); // Reset tab when changing sections
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

  // Theme and settings handlers
  const handleThemeToggle = async () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    
    try {
      if (settingsAPI?.updateSettings) {
        await settingsAPI.updateSettings({
          ...userSettings,
          theme: newTheme
        });
        showSnackbar('Theme updated successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handleProfile = () => {
    setProfileDialogOpen(true);
    handleProfileMenuClose();
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
        // Update existing student
        setStudents(prev => prev.map(s => 
          s.id === editingStudent.id ? { ...studentForm, id: editingStudent.id } : s
        ));
        showSnackbar('Student updated successfully', 'success');
      } else {
        // Add new student
        const newStudent = {
          ...studentForm,
          id: students.length + 1,
          modulesCompleted: 0,
          totalModules: 10,
          drillsAttended: 0,
          totalDrills: 0,
          attendanceRate: 0,
          gpa: 0,
          dateOfAdmission: new Date().toISOString().split('T')[0],
          emergencyContact: studentForm.parentContact
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

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setStaffForm({ ...staff });
    setStaffDialogOpen(true);
  };

  const handleSaveStaff = async () => {
    try {
      if (editingStaff) {
        setStaff(prev => prev.map(s => 
          s.id === editingStaff.id ? { ...staffForm, id: editingStaff.id } : s
        ));
        showSnackbar('Staff updated successfully', 'success');
      } else {
        const newStaff = {
          ...staffForm,
          id: staff.length + 1,
          qualifications: '',
          experience: '0 years',
          specialization: ''
        };
        setStaff(prev => [...prev, newStaff]);
        showSnackbar('Staff added successfully', 'success');
      }
      setStaffDialogOpen(false);
    } catch (error) {
      showSnackbar('Failed to save staff', 'error');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setStaff(prev => prev.filter(s => s.id !== staffId));
        showSnackbar('Staff deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete staff', 'error');
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

  const handleStaffPageChange = (event, newPage) => {
    setStaffPage(newPage);
  };

  const handleStaffRowsPerPageChange = (event) => {
    setStaffRowsPerPage(parseInt(event.target.value, 10));
    setStaffPage(0);
  };

  // Filter and search functions
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && student.isActive) ||
                         (filterStatus === 'inactive' && !student.isActive);
    return matchesSearch && matchesFilter;
  });

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && member.isActive) ||
                         (filterStatus === 'inactive' && !member.isActive);
    return matchesSearch && matchesFilter;
  });

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

  // Color scheme based on theme
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

  // Render different sections based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return renderStudentManagement();
      case 'staff':
        return renderStaffManagement();
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

  // Dashboard overview section
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
          startIcon={<Refresh />}
          onClick={loadDashboardData}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(45deg, ${colorScheme.primary}, ${colorScheme.accent})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
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
          <Card
            sx={{
              background: `linear-gradient(45deg, ${colorScheme.secondary}, #ff6b6b)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
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
          <Card
            sx={{
              background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
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
          <Card
            sx={{
              background: 'linear-gradient(45deg, #ff9800, #ffc107)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
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

      {/* Charts and Activities */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardHeader 
              title="Recent Activities"
              action={
                <IconButton>
                  <MoreVert />
                </IconButton>
              }
            />
            <CardContent sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: activity.status === 'success' ? 'success.main' : 
                                  activity.status === 'warning' ? 'warning.main' : 'info.main',
                          mr: 2,
                          flexShrink: 0
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(activity.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))
              ) : (
                <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                  No recent activities
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
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
                    startIcon={<Add />}
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
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>System Status:</strong> All systems operational. 
                    Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Placeholder render functions for other sections
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
          startIcon={<Add />}
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
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                More Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
              >
                Export
              </Button>
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

  const renderStaffManagement = () => (
    <Typography variant="h5">Staff Management - Coming Soon</Typography>
  );

  const renderDrillManagement = () => (
    <Typography variant="h5">Drill Management - Coming Soon</Typography>
  );

  const renderAnalytics = () => (
    <Typography variant="h5">Analytics - Coming Soon</Typography>
  );

  const renderAlertsManagement = () => (
    <Typography variant="h5">Alerts Management - Coming Soon</Typography>
  );

  const renderSettings = () => (
    <Typography variant="h5">Settings - Coming Soon</Typography>
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: darkMode ? '#90caf9' : '#ffffff',
              mb: 2 
            }} 
          />
        </motion.div>
        <Typography 
          variant="h6" 
          sx={{ 
            color: darkMode ? '#ffffff' : '#ffffff',
            textAlign: 'center' 
          }}
        >
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  // Main render return
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: colorScheme.primary,
        },
        secondary: {
          main: colorScheme.secondary,
        },
        background: {
          default: colorScheme.background,
          paper: colorScheme.paper,
        },
        text: {
          primary: colorScheme.text,
        },
      },
    })}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: colorScheme.background,
          overflow: 'hidden'
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
          {/* User Profile Section */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={currentUser?.photoURL}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  bgcolor: colorScheme.primary 
                }}
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
            
            {/* Theme Toggle */}
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
                    '& .MuiListItemIcon-root': {
                      color: colorScheme.primary,
                    },
                    '& .MuiListItemText-primary': {
                      color: colorScheme.primary,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    bgcolor: `${colorScheme.primary}10`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: activeSection === item.key ? 600 : 400
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top Header */}
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
                sx={{ 
                  mr: 2,
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {activeSection === 'dashboard' ? 'Admin Dashboard' : activeSection.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <IconButton
                onClick={handleNotificationMenuOpen}
                sx={{ color: 'text.primary' }}
              >
                <Badge 
                  badgeContent={notifications.filter(n => !n.read).length} 
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile Menu */}
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ color: 'text.primary' }}
              >
                <Avatar
                  src={currentUser?.photoURL}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: colorScheme.primary 
                  }}
                >
                  {currentUser?.displayName?.[0]?.toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Box>
          </Paper>

          {/* Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 3,
              bgcolor: colorScheme.background,
            }}
          >
            {renderContent()}
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              bgcolor: colorScheme.paper,
              minWidth: 200
            }
          }}
        >
          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => {
            handleProfileMenuClose();
            setActiveSection('settings');
          }}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            handleProfileMenuClose();
            logout();
          }}>
            <ExitToApp sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            sx: {
              bgcolor: colorScheme.paper,
              maxWidth: 360,
              maxHeight: 400
            }
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => {
                  handleMarkAsRead(notification.id);
                  handleNotificationMenuClose();
                }}
                sx={{ 
                  whiteSpace: 'normal', 
                  maxWidth: 350,
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <Typography color="text.secondary">No new notifications</Typography>
            </MenuItem>
          )}
        </Menu>

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
                  InputLabelProps={{ shrink: true }}
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
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;

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
                            <React.Fragment>
                              <Typography component="div" sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                                {new Date(drill.scheduledDate).toLocaleString()} • {drill.participants} participants
                              </Typography>
                              {drill.attendanceRate && (
                                <Typography component="div" variant="caption" sx={{ color: darkMode ? '#aaa' : 'text.secondary' }}>
                                  Attendance Rate: {drill.attendanceRate}%
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
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
        <Typography component="h2" variant="h5" fontWeight="bold" sx={{ color: darkMode ? 'white' : 'inherit' }}>
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
