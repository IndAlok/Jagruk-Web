import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Tab,
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Notifications,
  Warning,
  Groups,
  School,
  Assessment,
  Schedule,
  Emergency,
  Person,
  NotificationsActive,
  Menu as MenuIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import ProfileSidebar from '../Common/ProfileSidebar';
import Profile from '../Common/Profile';

const AdminDashboard = () => {
  const { currentUser: user } = useAuth();
  const { onlineUsers, alerts, sendAlert } = useSocket();
  
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [drills, setDrills] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Profile and sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Dialog states
  const [studentDialog, setStudentDialog] = useState(false);
  const [drillDialog, setDrillDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    priority: 'medium',
    type: 'general'
  });

  const [newDrill, setNewDrill] = useState({
    title: '',
    description: '',
    type: 'fire',
    scheduledAt: '',
    location: '',
    isVirtual: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from the correct endpoint
      const statsRes = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Fetch students data
      const studentsRes = await axios.get('/api/admin/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (statsRes.data.success) {
        setDashboardStats(statsRes.data.data);
      }
      
      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data);
      } else if (studentsRes.data.students) {
        // Handle legacy format
        setStudents(studentsRes.data.students);
      }

      // Set demo notifications for admin
      setNotifications([
        {
          id: 1,
          type: 'warning',
          title: 'System Update',
          message: 'New security patch available',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'info',
          title: 'Weekly Report',
          message: 'Weekly safety report is ready',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ]);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data');
      
      // Fallback demo data
      setDashboardStats({
        totalStudents: 1250,
        totalStaff: 85,
        activeUsers: 342,
        completedDrills: 15,
        pendingDrills: 3,
        totalAlerts: 8,
        unreadAlerts: 2
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Profile and navigation handlers
  const handleSidebarMenuClick = (key) => {
    switch (key) {
      case 'dashboard':
        setShowProfile(false);
        setActiveTab(0); // Show main dashboard
        break;
      case 'profile':
        setShowProfile(true);
        setSidebarOpen(false); // Close sidebar when showing profile
        break;
      case 'users':
        setActiveTab(1); // Show user management tab
        setShowProfile(false);
        break;
      case 'security':
        setActiveTab(2); // Show security tab
        setShowProfile(false);
        break;
      case 'settings':
        setActiveTab(3); // Show settings tab
        setShowProfile(false);
        break;
      default:
        break;
    }
  };

  // Add click handlers for various admin functions
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setStudentDialog(true);
  };

  const handleAddStaff = () => {
    // Open add staff dialog
    console.log('Add Staff clicked');
    // You can add staff dialog here
  };

  const handleSendBulkAlert = () => {
    setAlertDialog(true);
  };

  const handleScheduleDrill = () => {
    setDrillDialog(true);
  };

  const handleViewAnalytics = () => {
    console.log('View Analytics clicked');
    // Navigate to analytics view
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setStudentDialog(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/admin/students/${studentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Refresh students list
        fetchDashboardData();
      } catch (error) {
        console.error('Delete student error:', error);
      }
    }
  };

  const handleLogout = () => {
    // Logout logic handled by ProfileSidebar
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleSettings = () => {
    console.log('Settings');
    handleProfileMenuClose();
  };

  const handleProfile = () => {
    setShowProfile(true);
    handleProfileMenuClose();
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleSendAlert = async () => {
    try {
      await axios.post('/api/alerts', newAlert, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Send real-time alert
      sendAlert(newAlert);

      setAlertDialog(false);
      setNewAlert({
        title: '',
        message: '',
        priority: 'medium',
        type: 'general'
      });
    } catch (error) {
      console.error('Alert error:', error);
    }
  };

  const handleScheduleDrill = async () => {
    try {
      await axios.post('/api/drills', newDrill, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setDrillDialog(false);
      setNewDrill({
        title: '',
        description: '',
        type: 'fire',
        scheduledAt: '',
        location: '',
        isVirtual: false
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Drill error:', error);
    }
  };

  const getModulesCompletedText = (completed, total) => {
    return `${completed}/${total}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar with hamburger menu */}
      <AppBar position="fixed" elevation={2} sx={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jagruk Admin Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 'auto' }}
          >
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <ProfileSidebar
        open={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        role="admin"
        onMenuClick={handleSidebarMenuClick}
        onLogout={handleLogout}
        profileMenuAnchor={profileMenuAnchor}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleProfileMenuClose}
        onSettings={handleSettings}
        onProfile={handleProfile}
        user={user}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onNotificationClick={handleNotificationClick}
      />

      <Box p={3} sx={{ background: '#f5f5f5', minHeight: '100vh', pt: 10 }}>
        {showProfile ? (
          <Profile 
            user={user} 
            onClose={() => setShowProfile(false)}
            onBack={() => setShowProfile(false)}
          />
        ) : (
          <>
        {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Dashboard 🛡️
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage disaster preparedness across your institution
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card 
              elevation={3} 
              sx={{ 
                textAlign: 'center', 
                p: 2, 
                cursor: 'pointer',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 6 
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => setActiveTab(1)} // Navigate to student management
            >
              <School color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dashboardStats?.totalStudents || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
              <Groups color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {onlineUsers?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Online Now
              </Typography>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
              <Schedule color="warning" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dashboardStats?.upcomingDrills || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Drills
              </Typography>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
              <Badge badgeContent={alerts.length} color="error">
                <NotificationsActive color="error" sx={{ fontSize: 48, mb: 1 }} />
              </Badge>
              <Typography variant="h4" fontWeight="bold">
                {alerts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Alerts
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🚀 Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="error"
                startIcon={<Emergency />}
                onClick={() => setAlertDialog(true)}
              >
                Send Alert
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Schedule />}
                onClick={() => setDrillDialog(true)}
              >
                Schedule Drill
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<Assessment />}
              >
                View Reports
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Download />}
              >
                Export Data
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <Card elevation={3}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab label="Students" icon={<School />} />
            <Tab label="Drills" icon={<Schedule />} />
            <Tab label="Analytics" icon={<Assessment />} />
          </Tabs>

          <CardContent>
            {activeTab === 0 && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Student Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setStudentDialog(true)}
                  >
                    Add Student
                  </Button>
                </Box>

                <TableContainer component={Paper} elevation={2}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Admission Number
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Class
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Modules Completed
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Age
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student._id} hover>
                          <TableCell fontWeight="bold">
                            {student.admissionNumber}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`Class ${student.class}`}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Person sx={{ mr: 1, color: 'text.secondary' }} />
                              {student.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {getModulesCompletedText(
                                  student.completedModules?.length || 0,
                                  student.totalModules || 10
                                )}
                              </Typography>
                              <Chip
                                label={`${Math.round(((student.completedModules?.length || 0) / (student.totalModules || 10)) * 100)}%`}
                                color={
                                  ((student.completedModules?.length || 0) / (student.totalModules || 10)) * 100 >= 80
                                    ? 'success'
                                    : ((student.completedModules?.length || 0) / (student.totalModules || 10)) * 100 >= 50
                                    ? 'warning'
                                    : 'error'
                                }
                                size="small"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            {student.age} years
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => setSelectedStudent(student)}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary">
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error">
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {students.length === 0 && (
                  <Box textAlign="center" py={4}>
                    <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No students found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add students to get started with your disaster preparedness program
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Drill Management
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {drills.map((drill) => (
                    <Grid item xs={12} md={6} lg={4} key={drill._id}>
                      <Card elevation={2}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                            <Typography variant="h6" fontWeight="bold">
                              {drill.title}
                            </Typography>
                            <Chip
                              label={drill.type}
                              color={drill.type === 'emergency' ? 'error' : 'primary'}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {drill.description}
                          </Typography>
                          
                          <Box display="flex" alignItems="center" mb={1}>
                            <Schedule sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {new Date(drill.scheduledAt).toLocaleDateString()} at{' '}
                              {new Date(drill.scheduledAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Chip
                              label={drill.isVirtual ? 'Virtual' : 'Physical'}
                              color={drill.isVirtual ? 'secondary' : 'success'}
                              size="small"
                            />
                            <Box display="flex" gap={1}>
                              <IconButton size="small" color="primary">
                                <Edit />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {drills.length === 0 && (
                  <Box textAlign="center" py={4}>
                    <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No drills scheduled
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule your first drill to start emergency preparedness training
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Analytics Dashboard
                </Typography>
                <Box textAlign="center" py={4}>
                  <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Analytics Coming Soon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comprehensive analytics and reporting features will be available here
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Send Alert Dialog */}
      <Dialog
        open={alertDialog}
        onClose={() => setAlertDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Emergency sx={{ mr: 1, verticalAlign: 'middle' }} />
          Send Emergency Alert
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={3}
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newAlert.priority}
                  onChange={(e) => setNewAlert({ ...newAlert, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="weather">Weather</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendAlert}
            disabled={!newAlert.title || !newAlert.message}
          >
            Send Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Drill Dialog */}
      <Dialog
        open={drillDialog}
        onClose={() => setDrillDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
          Schedule New Drill
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Drill Title"
                value={newDrill.title}
                onChange={(e) => setNewDrill({ ...newDrill, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newDrill.description}
                onChange={(e) => setNewDrill({ ...newDrill, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newDrill.type}
                  onChange={(e) => setNewDrill({ ...newDrill, type: e.target.value })}
                >
                  <MenuItem value="fire">Fire Drill</MenuItem>
                  <MenuItem value="earthquake">Earthquake Drill</MenuItem>
                  <MenuItem value="lockdown">Lockdown Drill</MenuItem>
                  <MenuItem value="evacuation">Evacuation Drill</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                value={newDrill.location}
                onChange={(e) => setNewDrill({ ...newDrill, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Scheduled Date & Time"
                type="datetime-local"
                value={newDrill.scheduledAt}
                onChange={(e) => setNewDrill({ ...newDrill, scheduledAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrillDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleScheduleDrill}
            disabled={!newDrill.title || !newDrill.scheduledAt}
          >
            Schedule Drill
          </Button>
        </DialogActions>
      </Dialog>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
