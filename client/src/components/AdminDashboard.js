import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
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
  Drawer,
  AppBar,
  Toolbar,
  Fade,
  Zoom,
  Slide,
  Collapse,
  Tab,
  Tabs,
  Slider,
  FormGroup,
  RadioGroup,
  Radio,
  CardActions,
  Container,
  Stack,
  LinearProgress,
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
  Upload,
  Save,
  Cancel,
  Warning,
  Info,
  CheckCircle,
  Error,
  Close,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Group,
  Security,
  Palette,
  Language,
  VolumeUp,
  Brightness4,
  Brightness7,
  Logout,
  AccountCircle,
  NotificationImportant,
  ClearAll,
  MarkEmailRead,
  PriorityHigh,
  Cloud as CloudIcon,
  Inbox,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true for better UX
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Enhanced state for new features
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  
  // Tab states for dialogs
  const [settingsTab, setSettingsTab] = useState(0);
  const [notificationsTab, setNotificationsTab] = useState(0);
  const [alertsTab, setAlertsTab] = useState(0);
  
  // Settings state
  const [userSettings, setUserSettings] = useState({
    theme: {
      darkMode: false,
      animations: true,
      primaryColor: 'blue'
    },
    notifications: {
      email: {
        enabled: true,
        alerts: true,
        digest: false
      },
      push: {
        enabled: true,
        urgent: false
      },
      sms: false,
      sound: {
        enabled: true,
        volume: 50
      }
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      animations: true,
      language: 'en',
      timezone: 'UTC'
    },
    privacy: {
      dataCollection: true,
      crashReports: true,
      locationTracking: false
    }
  });
  
  // Enhanced data states
  const [stats, setStats] = useState({
    totalStudents: 1245,
    totalStaff: 87,
    activeDrills: 3,
    systemHealth: 98,
    completedDrills: 245,
    pendingAlerts: 2,
    activeUsers: 156,
    coursesCompleted: 89,
    averageGrade: 8.7,
    attendanceRate: 94.2,
  });
  
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [courses, setCourses] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  
  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  
  // Form states
  const [editingStudent, setEditingStudent] = useState(null);
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
  
  // Table states
  const [studentPage, setStudentPage] = useState(0);
  const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced data loading with comprehensive mock data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Enhanced mock activities
      setActivities([
        {
          id: 1,
          type: 'drill_completed',
          title: 'Fire Evacuation Drill Completed',
          description: 'All 1,245 students evacuated successfully in 3:47 minutes',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          icon: 'security',
          user: 'System',
          details: { duration: '3:47', participants: 1245, efficiency: 98.5 }
        },
        {
          id: 2,
          type: 'user_registered', 
          title: 'New Student Registration',
          description: 'Alice Johnson registered for Grade 10A - Computer Science Track',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'info',
          icon: 'person_add',
          user: 'Alice Johnson',
          details: { grade: '10A', track: 'Computer Science', admissionId: 'STU2024001' }
        },
        {
          id: 3,
          type: 'course_completed',
          title: 'Course Completion Milestone',
          description: '25 students completed Advanced Mathematics Module',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          icon: 'school',
          user: 'Academic System',
          details: { course: 'Advanced Mathematics', students: 25, averageScore: 87.3 }
        },
        {
          id: 4,
          type: 'alert_resolved',
          title: 'Weather Alert Resolved',
          description: 'Heavy rain warning has been lifted - All outdoor activities resumed',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          status: 'info',
          icon: 'check_circle',
          user: 'Weather Service',
          details: { alertType: 'Weather', duration: '4 hours', impact: 'Low' }
        }
      ]);

      // Enhanced mock notifications
      setNotifications([
        {
          id: 1,
          type: 'info',
          title: 'System Update Available',
          message: 'New security features and performance improvements are ready to install',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium',
          category: 'system',
          actionUrl: '/settings/updates'
        },
        {
          id: 2,
          type: 'warning',
          title: 'Maintenance Window Scheduled',
          message: 'Scheduled system maintenance tonight from 11 PM to 1 AM. Limited functionality expected.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          category: 'maintenance',
          actionUrl: '/maintenance'
        },
        {
          id: 3,
          type: 'success',
          title: 'Backup Completed Successfully',
          message: 'Daily data backup completed at 2:00 AM. All student and staff records secured.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low',
          category: 'backup',
          actionUrl: null
        }
      ]);

      // Enhanced mock alerts
      setAlerts([
        {
          id: 1,
          type: 'weather',
          severity: 'warning',
          title: 'Thunderstorm Warning',
          message: 'Severe thunderstorm expected between 2-5 PM. All outdoor activities postponed.',
          isActive: true,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          affectedUsers: 1332,
          location: 'Campus Wide',
          estimatedDuration: '3 hours',
          actions: ['Cancel outdoor classes', 'Move activities indoors', 'Issue safety advisory']
        },
        {
          id: 2,
          type: 'security',
          severity: 'high',
          title: 'Unusual Login Activity Detected',
          message: 'Multiple failed login attempts detected from unusual locations.',
          isActive: true,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          affectedUsers: 5,
          location: 'Network',
          estimatedDuration: 'Ongoing',
          actions: ['Temporary account locks', 'Enhanced monitoring', 'Security team notified']
        }
      ]);

      // Enhanced student data with more comprehensive information
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
          isActive: true,
          enrollmentDate: '2024-09-01',
          gpa: 3.85,
          attendance: 96.5,
          coursesEnrolled: 8,
          coursesCompleted: 6,
          emergencyContact: {
            name: 'John Johnson',
            relationship: 'Father',
            phone: '+1 (555) 123-4568',
            email: 'john.johnson@email.com'
          },
          academicInfo: {
            track: 'Computer Science',
            year: 'Sophomore',
            advisor: 'Dr. Sarah Mitchell',
            credits: 45,
            rank: 15
          },
          healthInfo: {
            allergies: 'None',
            medications: 'None',
            medicalNotes: 'No special requirements'
          }
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
          isActive: true,
          enrollmentDate: '2024-09-01',
          gpa: 3.92,
          attendance: 94.2,
          coursesEnrolled: 7,
          coursesCompleted: 5,
          emergencyContact: {
            name: 'Mary Smith',
            relationship: 'Mother',
            phone: '+1 (555) 234-5679',
            email: 'mary.smith@email.com'
          },
          academicInfo: {
            track: 'Engineering',
            year: 'Sophomore',
            advisor: 'Prof. Michael Chen',
            credits: 42,
            rank: 8
          },
          healthInfo: {
            allergies: 'Peanuts',
            medications: 'Inhaler (as needed)',
            medicalNotes: 'Asthma - keep inhaler accessible'
          }
        },
        {
          id: 3,
          name: 'Carol Davis',
          email: 'carol.d@student.jagruk.edu',
          admissionNumber: 'STU2023045',
          class: '11A',
          age: 17,
          parentContact: '+1 (555) 345-6789',
          address: '789 Pine Street, Springfield, IL 62703',
          isActive: true,
          enrollmentDate: '2023-09-01',
          gpa: 3.67,
          attendance: 91.8,
          coursesEnrolled: 9,
          coursesCompleted: 12,
          emergencyContact: {
            name: 'Robert Davis',
            relationship: 'Father',
            phone: '+1 (555) 345-6790',
            email: 'robert.davis@email.com'
          },
          academicInfo: {
            track: 'Liberal Arts',
            year: 'Junior',
            advisor: 'Dr. Emily Rodriguez',
            credits: 68,
            rank: 32
          },
          healthInfo: {
            allergies: 'Shellfish',
            medications: 'None',
            medicalNotes: 'Severe shellfish allergy - EpiPen on file'
          }
        }
      ]);

      // Enhanced staff data
      setStaff([
        {
          id: 1,
          name: 'Dr. Sarah Mitchell',
          email: 'sarah.mitchell@jagruk.edu',
          employeeId: 'EMP2020001',
          department: 'Computer Science',
          position: 'Department Head',
          phone: '+1 (555) 456-7890',
          dateOfJoining: '2020-08-15',
          isActive: true,
          salary: 95000,
          officeLocation: 'Tech Building, Room 301',
          qualifications: ['PhD in Computer Science - MIT', 'MS in Software Engineering - Stanford'],
          experience: '12 years',
          specializations: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
          coursesTeaching: ['Advanced Algorithms', 'AI Fundamentals', 'Data Structures'],
          students: 145,
          publications: 23,
          awards: ['Excellence in Teaching 2023', 'Research Innovation Award 2022']
        },
        {
          id: 2,
          name: 'Prof. Michael Chen',
          email: 'michael.chen@jagruk.edu',
          employeeId: 'EMP2019015',
          department: 'Engineering',
          position: 'Senior Professor',
          phone: '+1 (555) 567-8901',
          dateOfJoining: '2019-07-20',
          isActive: true,
          salary: 87000,
          officeLocation: 'Engineering Block, Room 205',
          qualifications: ['PhD in Mechanical Engineering - Caltech', 'MS in Robotics - CMU'],
          experience: '15 years',
          specializations: ['Robotics', 'Automation', 'Manufacturing Systems'],
          coursesTeaching: ['Introduction to Robotics', 'Manufacturing Processes', 'CAD Design'],
          students: 98,
          publications: 31,
          awards: ['Industry Collaboration Award 2023', 'Best Faculty 2021']
        },
        {
          id: 3,
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@jagruk.edu',
          employeeId: 'EMP2021008',
          department: 'Liberal Arts',
          position: 'Associate Professor',
          phone: '+1 (555) 678-9012',
          dateOfJoining: '2021-06-01',
          isActive: true,
          salary: 72000,
          officeLocation: 'Humanities Building, Room 150',
          qualifications: ['PhD in English Literature - Harvard', 'MA in Creative Writing - Iowa'],
          experience: '8 years',
          specializations: ['Modern Literature', 'Creative Writing', 'Literary Criticism'],
          coursesTeaching: ['World Literature', 'Creative Writing Workshop', 'Literary Analysis'],
          students: 76,
          publications: 15,
          awards: ['Creative Excellence Award 2022']
        }
      ]);

      // Enhanced courses data
      setCourses([
        {
          id: 1,
          code: 'CS-401',
          name: 'Advanced Data Structures & Algorithms',
          description: 'Comprehensive study of advanced data structures, algorithm design paradigms, and complexity analysis.',
          instructor: 'Dr. Sarah Mitchell',
          instructorId: 1,
          department: 'Computer Science',
          credits: 4,
          duration: '16 weeks',
          schedule: {
            days: ['Monday', 'Wednesday', 'Friday'],
            times: '10:00 AM - 11:30 AM',
            room: 'CS Lab 1'
          },
          capacity: 35,
          enrolled: 32,
          waitlist: 5,
          prerequisites: ['CS-201', 'MATH-205'],
          status: 'Active',
          startDate: '2024-09-02',
          endDate: '2024-12-20',
          examDate: '2024-12-18',
          syllabus: {
            topics: ['Advanced Trees', 'Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms', 'String Algorithms'],
            assignments: 8,
            projects: 2,
            midterm: '2024-10-25',
            final: '2024-12-18'
          },
          grading: {
            assignments: '40%',
            projects: '30%',
            midterm: '15%',
            final: '15%'
          }
        },
        {
          id: 2,
          code: 'ENG-301',
          name: 'Robotics and Automation',
          description: 'Introduction to robotic systems, automation principles, and industrial applications.',
          instructor: 'Prof. Michael Chen',
          instructorId: 2,
          department: 'Engineering',
          credits: 3,
          duration: '16 weeks',
          schedule: {
            days: ['Tuesday', 'Thursday'],
            times: '2:00 PM - 3:30 PM',
            room: 'Engineering Lab 2'
          },
          capacity: 25,
          enrolled: 23,
          waitlist: 3,
          prerequisites: ['ENG-201', 'MATH-301'],
          status: 'Active',
          startDate: '2024-09-03',
          endDate: '2024-12-19',
          examDate: '2024-12-17',
          syllabus: {
            topics: ['Robot Kinematics', 'Control Systems', 'Sensors & Actuators', 'Programming', 'Applications'],
            assignments: 6,
            projects: 3,
            midterm: '2024-10-24',
            final: '2024-12-17'
          },
          grading: {
            assignments: '35%',
            projects: '40%',
            midterm: '12.5%',
            final: '12.5%'
          }
        },
        {
          id: 3,
          code: 'LIT-250',
          name: 'World Literature & Cultural Studies',
          description: 'Exploration of global literature and its cultural contexts from ancient to contemporary times.',
          instructor: 'Dr. Emily Rodriguez',
          instructorId: 3,
          department: 'Liberal Arts',
          credits: 3,
          duration: '16 weeks',
          schedule: {
            days: ['Monday', 'Wednesday'],
            times: '11:00 AM - 12:30 PM',
            room: 'Humanities 201'
          },
          capacity: 30,
          enrolled: 28,
          waitlist: 2,
          prerequisites: ['LIT-101'],
          status: 'Active',
          startDate: '2024-09-02',
          endDate: '2024-12-20',
          examDate: '2024-12-16',
          syllabus: {
            topics: ['Ancient Epics', 'Medieval Literature', 'Renaissance Works', 'Modern Classics', 'Contemporary Voices'],
            assignments: 5,
            projects: 1,
            midterm: '2024-10-23',
            final: '2024-12-16'
          },
          grading: {
            assignments: '50%',
            projects: '25%',
            midterm: '12.5%',
            final: '12.5%'
          }
        }
      ]);

      // Enhanced system logs with comprehensive information
      setSystemLogs([
        {
          id: 1,
          timestamp: new Date('2024-01-15T09:30:00'),
          level: 'INFO',
          category: 'Authentication',
          source: 'Auth Service',
          message: 'User login successful',
          details: {
            userId: 'admin001',
            username: 'admin@jagruk.edu',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            sessionId: 'sess_abc123def456',
            loginMethod: 'email_password'
          },
          severity: 'low',
          resolved: true,
          tags: ['authentication', 'success', 'admin']
        },
        {
          id: 2,
          timestamp: new Date('2024-01-15T10:15:30'),
          level: 'WARNING',
          category: 'Security',
          source: 'Rate Limiter',
          message: 'Multiple failed login attempts detected',
          details: {
            targetAccount: 'student.test@jagruk.edu',
            ipAddress: '203.45.67.89',
            attemptCount: 5,
            timeWindow: '5 minutes',
            action: 'IP temporarily blocked',
            blockDuration: '15 minutes'
          },
          severity: 'medium',
          resolved: true,
          tags: ['security', 'failed_login', 'rate_limit']
        },
        {
          id: 3,
          timestamp: new Date('2024-01-15T11:45:15'),
          level: 'ERROR',
          category: 'Database',
          source: 'Firebase Firestore',
          message: 'Connection timeout during student data retrieval',
          details: {
            operation: 'GET /api/students',
            collection: 'students',
            queryTimeout: '30s',
            retryAttempts: 3,
            errorCode: 'DEADLINE_EXCEEDED',
            affectedUsers: 12
          },
          severity: 'high',
          resolved: false,
          tags: ['database', 'timeout', 'firestore', 'students']
        },
        {
          id: 4,
          timestamp: new Date('2024-01-15T14:20:45'),
          level: 'INFO',
          category: 'System',
          source: 'Backup Service',
          message: 'Daily backup completed successfully',
          details: {
            backupType: 'incremental',
            dataSize: '2.3 GB',
            duration: '15 minutes',
            location: 'gs://jagruk-backups/2024-01-15/',
            filesBackedUp: 1245,
            compressionRatio: '65%'
          },
          severity: 'low',
          resolved: true,
          tags: ['backup', 'success', 'daily']
        },
        {
          id: 5,
          timestamp: new Date('2024-01-15T16:10:22'),
          level: 'WARNING',
          category: 'Performance',
          source: 'Application Monitor',
          message: 'High memory usage detected on server instance',
          details: {
            serverInstance: 'jagruk-web-prod-1',
            memoryUsage: '87%',
            threshold: '80%',
            duration: '10 minutes',
            processes: ['node', 'firebase-functions'],
            recommendation: 'Consider scaling up instance'
          },
          severity: 'medium',
          resolved: false,
          tags: ['performance', 'memory', 'monitoring']
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

  // Enhanced Material-UI theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { 
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: { 
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#fafafa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1a1a1a',
        secondary: darkMode ? '#e0e0e0' : '#616161',
      },
      divider: darkMode ? '#424242' : '#e0e0e0',
      success: { 
        main: darkMode ? '#4caf50' : '#2e7d32',
      },
      warning: { 
        main: darkMode ? '#ff9800' : '#f57c00',
      },
      error: { 
        main: darkMode ? '#f44336' : '#d32f2f',
      },
      info: { 
        main: darkMode ? '#2196f3' : '#1976d2',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.75rem' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 500, fontSize: '1.25rem' },
      h6: { fontWeight: 500, fontSize: '1rem' },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: darkMode ? '1px solid #424242' : '1px solid #e0e0e0',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.12)',
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 20px',
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
            backgroundImage: darkMode
              ? 'linear-gradient(180deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          }
        }
      }
    }
  });

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
        // Open alerts dialog when alerts section is selected
        if (!alertsDialogOpen) {
          setAlertsDialogOpen(true);
          setActiveSection('dashboard'); // Return to dashboard
        }
        return renderDashboardOverview();
      case 'settings':
        // Open settings dialog when settings section is selected
        if (!settingsDialogOpen) {
          setSettingsDialogOpen(true);
          setActiveSection('dashboard'); // Return to dashboard
        }
        return renderDashboardOverview();
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
          <Card sx={{ 
            background: 'linear-gradient(45deg, #1976d2, #3f51b5)', 
            color: 'white' 
          }}>
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
          <Card sx={{ 
            background: 'linear-gradient(45deg, #dc004e, #ff6b6b)', 
            color: 'white' 
          }}>
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
          <Card sx={{ 
            background: 'linear-gradient(45deg, #4caf50, #8bc34a)', 
            color: 'white' 
          }}>
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
          <Card sx={{ 
            background: 'linear-gradient(45deg, #ff9800, #ffc107)', 
            color: 'white' 
          }}>
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
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Sidebar */}
        <Paper
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            display: { xs: sidebarOpen ? 'block' : 'none', md: 'block' },
            position: { xs: 'fixed', md: 'relative' },
            height: '100vh',
            zIndex: 1200,
          }}
        >
          {/* User Profile */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}
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
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRight: 3,
                    borderColor: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
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
              borderBottom: 1,
              borderColor: 'divider',
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
                sx={{ 
                  color: alerts.filter(a => a.isActive).length > 0 ? 'error.main' : 'inherit',
                  position: 'relative'
                }}
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
                sx={{ 
                  color: notifications.filter(n => !n.read).length > 0 ? 'primary.main' : 'inherit',
                  position: 'relative'
                }}
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
              <IconButton 
                onClick={() => setSettingsDialogOpen(true)}
                title="Settings"
              >
                <SettingsIcon />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton 
                onClick={handleThemeToggle}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {/* Profile Menu */}
              <IconButton 
                onClick={handleProfileMenuOpen}
                title="Profile Menu"
              >
                <Person />
              </IconButton>
            </Box>
          </Paper>

          {/* Content Area */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: 'background.default' }}>
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
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }
            }
          }}
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

        {/* Enhanced Settings Dialog */}
        <Dialog 
          open={settingsDialogOpen} 
          onClose={() => setSettingsDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(156,39,176,0.1) 100%)'
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <SettingsIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h5" component="span">
                System Settings
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Tabs 
              value={settingsTab} 
              onChange={(e, v) => setSettingsTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Palette />} label="Theme" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<Security />} label="Privacy" />
              <Tab icon={<Language />} label="System" />
            </Tabs>

            <Box sx={{ p: 3, minHeight: 400 }}>
              {/* Theme Settings */}
              {settingsTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Theme Preferences
                  </Typography>
                  
                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userSettings.theme.darkMode}
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                theme: { ...prev.theme, darkMode: e.target.checked }
                              }))}
                            />
                          }
                          label={
                            <Box display="flex" alignItems="center" gap={1}>
                              {userSettings.theme.darkMode ? <Brightness4 /> : <Brightness7 />}
                              <Typography>Dark Mode</Typography>
                            </Box>
                          }
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userSettings.theme.animations}
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                theme: { ...prev.theme, animations: e.target.checked }
                              }))}
                            />
                          }
                          label="Enable Animations"
                        />
                      </FormGroup>

                      <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                        Primary Color
                      </Typography>
                      <RadioGroup
                        value={userSettings.theme.primaryColor}
                        onChange={(e) => setUserSettings(prev => ({
                          ...prev,
                          theme: { ...prev.theme, primaryColor: e.target.value }
                        }))}
                        row
                      >
                        {['blue', 'purple', 'green', 'orange'].map(color => (
                          <FormControlLabel
                            key={color}
                            value={color}
                            control={<Radio />}
                            label={color.charAt(0).toUpperCase() + color.slice(1)}
                          />
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Notification Settings */}
              {settingsTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Notification Preferences
                  </Typography>

                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Email Notifications
                          </Typography>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={userSettings.notifications.email.enabled}
                                  onChange={(e) => setUserSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      email: { ...prev.notifications.email, enabled: e.target.checked }
                                    }
                                  }))}
                                />
                              }
                              label="Enable Email Notifications"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={userSettings.notifications.email.alerts}
                                  onChange={(e) => setUserSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      email: { ...prev.notifications.email, alerts: e.target.checked }
                                    }
                                  }))}
                                />
                              }
                              label="Alert Emails"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={userSettings.notifications.email.digest}
                                  onChange={(e) => setUserSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      email: { ...prev.notifications.email, digest: e.target.checked }
                                    }
                                  }))}
                                />
                              }
                              label="Daily Digest"
                            />
                          </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Push Notifications
                          </Typography>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={userSettings.notifications.push.enabled}
                                  onChange={(e) => setUserSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      push: { ...prev.notifications.push, enabled: e.target.checked }
                                    }
                                  }))}
                                />
                              }
                              label="Enable Push Notifications"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={userSettings.notifications.push.urgent}
                                  onChange={(e) => setUserSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      push: { ...prev.notifications.push, urgent: e.target.checked }
                                    }
                                  }))}
                                />
                              }
                              label="Urgent Alerts Only"
                            />
                          </FormGroup>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Sound Volume
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <VolumeUp />
                            <Slider
                              value={userSettings.notifications.sound.volume}
                              onChange={(e, value) => setUserSettings(prev => ({
                                ...prev,
                                notifications: {
                                  ...prev.notifications,
                                  sound: { ...prev.notifications.sound, volume: value }
                                }
                              }))}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                              sx={{ flexGrow: 1 }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Privacy Settings */}
              {settingsTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Privacy & Security
                  </Typography>

                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userSettings.privacy.dataCollection}
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, dataCollection: e.target.checked }
                              }))}
                            />
                          }
                          label="Allow Analytics Data Collection"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userSettings.privacy.crashReports}
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, crashReports: e.target.checked }
                              }))}
                            />
                          }
                          label="Send Crash Reports"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userSettings.privacy.locationTracking}
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, locationTracking: e.target.checked }
                              }))}
                            />
                          }
                          label="Enable Location Services"
                        />
                      </FormGroup>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* System Settings */}
              {settingsTab === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    System Configuration
                  </Typography>

                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value={userSettings.dashboard.language}
                              label="Language"
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                dashboard: { ...prev.dashboard, language: e.target.value }
                              }))}
                            >
                              <MenuItem value="en">English</MenuItem>
                              <MenuItem value="es">Spanish</MenuItem>
                              <MenuItem value="fr">French</MenuItem>
                              <MenuItem value="de">German</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                              value={userSettings.dashboard.timezone}
                              label="Timezone"
                              onChange={(e) => setUserSettings(prev => ({
                                ...prev,
                                dashboard: { ...prev.dashboard, timezone: e.target.value }
                              }))}
                            >
                              <MenuItem value="UTC">UTC</MenuItem>
                              <MenuItem value="EST">Eastern Time</MenuItem>
                              <MenuItem value="PST">Pacific Time</MenuItem>
                              <MenuItem value="GMT">GMT</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={userSettings.dashboard.autoRefresh}
                                onChange={(e) => setUserSettings(prev => ({
                                  ...prev,
                                  dashboard: { ...prev.dashboard, autoRefresh: e.target.checked }
                                }))}
                              />
                            }
                            label="Auto-refresh Dashboard Data"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={() => {
                setSettingsDialogOpen(false);
                showSnackbar('Settings saved successfully', 'success');
              }}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                }
              }}
            >
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Notifications Management Dialog */}
        <Dialog 
          open={notificationsDialogOpen} 
          onClose={() => setNotificationsDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              minHeight: '70vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(103,58,183,0.1) 100%)'
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <NotificationsIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h5" component="span">
                  Notifications Center
                </Typography>
                <Chip 
                  label={`${notifications.filter(n => !n.read).length} unread`}
                  color="primary"
                  size="small"
                />
              </Box>
              <Button
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  showSnackbar('All notifications marked as read', 'success');
                }}
                startIcon={<CheckCircle />}
                size="small"
              >
                Mark All Read
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Tabs 
              value={notificationsTab} 
              onChange={(e, v) => setNotificationsTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab icon={<Inbox />} label="All" />
              <Tab icon={<Warning />} label="Alerts" />
              <Tab icon={<Info />} label="System" />
              <Tab icon={<Email />} label="Messages" />
            </Tabs>

            <Box sx={{ p: 2, maxHeight: '60vh', overflow: 'auto' }}>
              {notifications
                .filter(notification => {
                  if (notificationsTab === 0) return true;
                  if (notificationsTab === 1) return notification.type === 'alert';
                  if (notificationsTab === 2) return notification.type === 'system';
                  if (notificationsTab === 3) return notification.type === 'message';
                  return true;
                })
                .map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: notification.read ? 'divider' : 'primary.main',
                        background: notification.read ? 'transparent' : 'rgba(25,118,210,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <Avatar sx={{ 
                            bgcolor: notification.priority === 'high' ? 'error.main' : 
                                    notification.priority === 'medium' ? 'warning.main' : 'info.main',
                            width: 40, height: 40 
                          }}>
                            {notification.type === 'alert' && <Warning />}
                            {notification.type === 'system' && <Info />}
                            {notification.type === 'message' && <Email />}
                          </Avatar>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {notification.title}
                              </Typography>
                              <Chip 
                                label={notification.priority.toUpperCase()}
                                size="small"
                                color={notification.priority === 'high' ? 'error' : 
                                      notification.priority === 'medium' ? 'warning' : 'default'}
                              />
                              {!notification.read && (
                                <Box 
                                  sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: 'primary.main' 
                                  }} 
                                />
                              )}
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {notification.message}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                {new Date(notification.timestamp).toLocaleString()}
                              </Typography>
                              
                              <Box>
                                <IconButton 
                                  size="small"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={notification.read}
                                >
                                  <Visibility />
                                </IconButton>
                                <IconButton 
                                  size="small"
                                  onClick={() => {
                                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                    showSnackbar('Notification deleted', 'success');
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Actions:
                                </Typography>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                  {notification.actions.map((action, actionIndex) => (
                                    <Button
                                      key={actionIndex}
                                      size="small"
                                      variant={action.primary ? "contained" : "outlined"}
                                      onClick={() => {
                                        showSnackbar(`Action: ${action.label}`, 'info');
                                      }}
                                    >
                                      {action.label}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              }
              
              {notifications.length === 0 && (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  py={8}
                >
                  <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You're all caught up!
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setNotificationsDialogOpen(false)}>
              Close
            </Button>
            <Button 
              variant="contained"
              onClick={() => {
                setNotifications([]);
                showSnackbar('All notifications cleared', 'success');
              }}
              sx={{
                background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d32f2f 0%, #c2185b 100%)',
                }
              }}
            >
              Clear All
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Alerts Management Dialog */}
        <Dialog 
          open={alertsDialogOpen} 
          onClose={() => setAlertsDialogOpen(false)}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              minHeight: '80vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(244,67,54,0.1) 0%, rgba(255,152,0,0.1) 100%)'
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Warning sx={{ color: 'error.main' }} />
                <Typography variant="h5" component="span">
                  Emergency Alerts Management
                </Typography>
                <Chip 
                  label={`${alerts.filter(a => a.status === 'active').length} active`}
                  color="error"
                  size="small"
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  showSnackbar('New alert creation coming soon', 'info');
                }}
                sx={{
                  background: 'linear-gradient(135deg, #ff5722 0%, #ff9800 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e64a19 0%, #f57c00 100%)',
                  }
                }}
              >
                Create Alert
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Tabs 
              value={alertsTab} 
              onChange={(e, v) => setAlertsTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab icon={<Warning />} label="Active" />
              <Tab icon={<Schedule />} label="Scheduled" />
              <Tab icon={<CheckCircle />} label="Resolved" />
              <Tab icon={<Assessment />} label="Analytics" />
            </Tabs>

            <Box sx={{ p: 3, maxHeight: '65vh', overflow: 'auto' }}>
              {/* Active Alerts */}
              {alertsTab === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    {alerts
                      .filter(alert => alert.status === 'active')
                      .map((alert, index) => (
                        <Grid item xs={12} lg={6} key={alert.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card 
                              sx={{ 
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: alert.severity === 'critical' ? 'error.main' : 
                                           alert.severity === 'high' ? 'warning.main' : 'info.main',
                                background: `linear-gradient(135deg, ${
                                  alert.severity === 'critical' ? 'rgba(244,67,54,0.1)' : 
                                  alert.severity === 'high' ? 'rgba(255,152,0,0.1)' : 
                                  'rgba(33,150,243,0.1)'
                                } 0%, rgba(255,255,255,0.05) 100%)`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 8
                                }
                              }}
                            >
                              <CardContent>
                                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                                  <Avatar sx={{ 
                                    bgcolor: alert.severity === 'critical' ? 'error.main' : 
                                            alert.severity === 'high' ? 'warning.main' : 'info.main',
                                    width: 48, height: 48 
                                  }}>
                                    {alert.type === 'weather' && <CloudIcon />}
                                    {alert.type === 'security' && <Security />}
                                    {alert.type === 'system' && <Error />}
                                  </Avatar>
                                  
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {alert.title}
                                      </Typography>
                                      <Chip 
                                        label={alert.severity.toUpperCase()}
                                        color={alert.severity === 'critical' ? 'error' : 
                                              alert.severity === 'high' ? 'warning' : 'info'}
                                        size="small"
                                      />
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                      {alert.description}
                                    </Typography>
                                    
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <Group fontSize="small" />
                                        <Typography variant="caption">
                                          {alert.affectedUsers} users affected
                                        </Typography>
                                      </Box>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <Schedule fontSize="small" />
                                        <Typography variant="caption">
                                          {new Date(alert.timestamp).toLocaleString()}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    
                                    {alert.location && (
                                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <LocationOn fontSize="small" />
                                        <Typography variant="body2">
                                          {alert.location}
                                        </Typography>
                                      </Box>
                                    )}
                                    
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={alert.progress} 
                                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      Resolution Progress: {alert.progress}%
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Collapse in={true}>
                                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Actions Taken:
                                    </Typography>
                                    <Box display="flex" gap={1} flexWrap="wrap">
                                      {alert.actions.map((action, actionIndex) => (
                                        <Chip
                                          key={actionIndex}
                                          label={action}
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                </Collapse>
                                
                                <CardActions sx={{ px: 0, pt: 2 }}>
                                  <Button 
                                    size="small" 
                                    variant="contained"
                                    onClick={() => showSnackbar('Alert acknowledged', 'success')}
                                  >
                                    Acknowledge
                                  </Button>
                                  <Button 
                                    size="small"
                                    onClick={() => showSnackbar('More details coming soon', 'info')}
                                  >
                                    Details
                                  </Button>
                                  <Button 
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      setAlerts(prev => prev.map(a => 
                                        a.id === alert.id ? { ...a, status: 'resolved' } : a
                                      ));
                                      showSnackbar('Alert resolved', 'success');
                                    }}
                                  >
                                    Resolve
                                  </Button>
                                </CardActions>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))
                    }
                  </Grid>
                  
                  {alerts.filter(a => a.status === 'active').length === 0 && (
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center" 
                      justifyContent="center" 
                      py={8}
                    >
                      <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Active Alerts
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        All systems are operating normally
                      </Typography>
                    </Box>
                  )}
                </motion.div>
              )}

              {/* Other tabs placeholders */}
              {alertsTab === 1 && (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  py={8}
                >
                  <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Scheduled Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No scheduled alerts at this time
                  </Typography>
                </Box>
              )}

              {alertsTab === 2 && (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  py={8}
                >
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Resolved Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View historical alert data
                  </Typography>
                </Box>
              )}

              {alertsTab === 3 && (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  py={8}
                >
                  <Assessment sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Alert Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comprehensive alert statistics and trends
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setAlertsDialogOpen(false)}>
              Close
            </Button>
            <Button 
              variant="contained"
              onClick={() => showSnackbar('Bulk actions coming soon', 'info')}
              sx={{
                background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                }
              }}
            >
              Bulk Actions
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
