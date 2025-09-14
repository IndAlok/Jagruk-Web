import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Warning as EmergencyIcon, // Using Warning icon as Emergency
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

// Sample data - will be replaced by API calls
const sampleStudents = [
  { id: 1, admissionNumber: 'ADM001', class: 10, name: 'Rahul Sharma', modulesCompleted: 8, age: 16 },
  { id: 2, admissionNumber: 'ADM002', class: 9, name: 'Priya Patel', modulesCompleted: 6, age: 15 },
  { id: 3, admissionNumber: 'ADM003', class: 11, name: 'Amit Kumar', modulesCompleted: 12, age: 17 },
  { id: 4, admissionNumber: 'ADM004', class: 10, name: 'Sneha Reddy', modulesCompleted: 9, age: 16 },
  { id: 5, admissionNumber: 'ADM005', class: 12, name: 'Vikram Singh', modulesCompleted: 15, age: 18 },
];

const emergencyAlerts = [
  { id: 1, type: 'Fire Drill', message: 'Scheduled fire drill at 2:30 PM', severity: 'warning', time: '10 min ago' },
  { id: 2, type: 'Weather Alert', message: 'Heavy rain warning issued', severity: 'info', time: '1 hour ago' },
  { id: 3, type: 'System Update', message: 'Emergency system updated successfully', severity: 'success', time: '2 hours ago' },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = ({ serverStatus = 'connected' }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(sampleStudents);
  const [stats] = useState({
    totalStudents: sampleStudents.length,
    activeDrills: 3,
    systemHealth: 98,
    totalAlerts: emergencyAlerts.length
  });
  const [socket, setSocket] = useState(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketConnection = io('http://localhost:5000');
    setSocket(socketConnection);

    // Load initial data
    loadStudents();

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  const loadStudents = async () => {
    try {
      // For now, using sample data. Replace with actual API call:
      // const data = await studentAPI.getStudents();
      // setStudents(data.students);
      setStudents(sampleStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const loadStats = async () => {
    try {
      // For now, using sample data. Replace with actual API call:
      // const data = await dashboardAPI.getStats();
      // setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLogout = () => {
    logout();
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (connected) => {
    return connected ? 'success' : 'error';
  };

  const getStatusText = (status) => {
    if (status.checking) return 'Checking...';
    return status.connected ? 'Connected' : 'Disconnected';
  };

  const handleEmergencyAction = async (type) => {
    try {
      // Broadcast emergency alert
      // await alertAPI.broadcastEmergency({
      //   type,
      //   message: `${type} emergency initiated`,
      //   severity: 'error'
      // });
      alert(`${type} emergency protocol initiated!`);
    } catch (error) {
      console.error('Failed to broadcast emergency:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <EmergencyIcon sx={{ mr: 1 }} />
            Jagruk - Disaster Management System
          </Typography>
          
          {/* User Info */}
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.name || user?.email || 'Admin'}
          </Typography>
          
          {/* Server Status Indicator */}
          <Tooltip title={`Server Status: ${getStatusText(serverStatus)}`}>
            <Chip
              icon={serverStatus.connected ? <CheckCircleIcon /> : <CancelIcon />}
              label={getStatusText(serverStatus)}
              color={getStatusColor(serverStatus.connected)}
              variant="outlined"
              sx={{ mr: 2, color: 'white', borderColor: 'white' }}
            />
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<PeopleIcon />} label="Students" />
            <Tab icon={<EmergencyIcon />} label="Quick Actions" />
            <Tab icon={<SecurityIcon />} label="Activities" />
          </Tabs>
        </Paper>

        {/* Dashboard Tab */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Total Students
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalStudents}
                      </Typography>
                    </Box>
                    <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Active Drills
                      </Typography>
                      <Typography variant="h4">
                        {stats.activeDrills}
                      </Typography>
                    </Box>
                    <EmergencyIcon color="warning" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        System Health
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {stats.systemHealth}%
                      </Typography>
                    </Box>
                    <SpeedIcon color="success" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Alerts
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {stats.totalAlerts}
                      </Typography>
                    </Box>
                    <WarningIcon color="error" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Emergency Alerts */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsIcon sx={{ mr: 1 }} />
                    Recent Emergency Alerts
                  </Typography>
                  {emergencyAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      severity={alert.severity}
                      sx={{ mb: 1 }}
                      action={
                        <Typography variant="caption" color="textSecondary">
                          {alert.time}
                        </Typography>
                      }
                    >
                      <AlertTitle>{alert.type}</AlertTitle>
                      {alert.message}
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Students Tab */}
        <TabPanel value={currentTab} index={1}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Student Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Add Student
                  </Button>
                  <Button variant="outlined" startIcon={<UploadIcon />}>
                    Import
                  </Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />}>
                    Export
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Admission Number</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Modules Completed</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell>{student.admissionNumber}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={student.modulesCompleted} 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={(student.modulesCompleted / 20) * 100}
                              sx={{ width: 100, mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {Math.round((student.modulesCompleted / 20) * 100)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Quick Actions Tab */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmergencyIcon sx={{ mr: 1, color: 'error.main' }} />
                    Emergency Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="large"
                      onClick={() => handleEmergencyAction('FIRE')}
                    >
                      🚨 FIRE EMERGENCY
                    </Button>
                    <Button 
                      variant="contained" 
                      color="warning" 
                      size="large"
                      onClick={() => handleEmergencyAction('NATURAL DISASTER')}
                    >
                      🌪️ NATURAL DISASTER
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="large"
                      onClick={() => handleEmergencyAction('MEDICAL')}
                    >
                      🏥 MEDICAL EMERGENCY
                    </Button>
                    <Button 
                      variant="contained" 
                      color="info" 
                      size="large"
                      onClick={() => handleEmergencyAction('SECURITY')}
                    >
                      🔒 SECURITY LOCKDOWN
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Drill Management
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" color="primary" size="large">
                      📋 Schedule New Drill
                    </Button>
                    <Button variant="outlined" color="success" size="large">
                      ▶️ Start Active Drill
                    </Button>
                    <Button variant="outlined" color="warning" size="large">
                      📊 View Drill Reports
                    </Button>
                    <Button variant="outlined" color="info" size="large">
                      ⚙️ Configure Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Activities Tab */}
        <TabPanel value={currentTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Activity Log
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Alert severity="info">
                      <AlertTitle>10:30 AM</AlertTitle>
                      System health check completed - All systems operational
                    </Alert>
                    <Alert severity="success">
                      <AlertTitle>09:45 AM</AlertTitle>
                      Fire drill completed successfully - 98% participation
                    </Alert>
                    <Alert severity="warning">
                      <AlertTitle>09:15 AM</AlertTitle>
                      Student database backup initiated
                    </Alert>
                    <Alert severity="info">
                      <AlertTitle>08:30 AM</AlertTitle>
                      New student registration: 3 students added
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
