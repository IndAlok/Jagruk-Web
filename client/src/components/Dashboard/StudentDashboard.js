import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  School,
  Assignment,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Notifications,
  Emergency,
  Groups,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import ProfileSidebar from '../Common/ProfileSidebar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { onlineUsers, alerts } = useSocket();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Fire Drill Tomorrow',
      message: 'Mandatory fire drill scheduled for tomorrow at 10:00 AM. Please be present.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Course Materials Updated',
      message: 'New study materials have been uploaded for your emergency preparedness course',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/student', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarMenuClick = (key) => {
    // Handle sidebar navigation
    switch (key) {
      case 'dashboard':
        // Already on dashboard
        break;
      case 'courses':
        console.log('Navigate to courses');
        break;
      case 'notifications':
        console.log('Navigate to notifications');
        break;
      case 'settings':
        console.log('Navigate to settings');
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

  const handleLogout = () => {
    // Implement logout
    console.log('Logout');
    handleProfileMenuClose();
  };

  const handleSettings = () => {
    console.log('Settings');
    handleProfileMenuClose();
  };

  const handleProfile = () => {
    console.log('Profile');
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ProfileSidebar
        open={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        role="student"
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

      <Box sx={{ p: 3, pt: 10 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
          Let's continue your disaster preparedness journey
        </Typography>
      </Box>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Alert 
            severity={alerts[0].priority === 'high' ? 'error' : 'warning'}
            icon={<Emergency />}
            action={
              <Button color="inherit" size="small">
                View Details
              </Button>
            }
          >
            <strong>{alerts[0].title}</strong> - {alerts[0].message}
          </Alert>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: 'primary.main',
                      mr: 2
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Class {user?.class} • Age {user?.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Admission: {user?.admissionNumber}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboardData?.overallProgress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dashboardData?.overallProgress || 0}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                  <Assignment color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardData?.completedModules || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modules Complete
                  </Typography>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={6} sm={3}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                  <Groups color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardData?.drillsAttended || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drills Attended
                  </Typography>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={6} sm={3}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                  <Star color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardData?.points || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Earned
                  </Typography>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={6} sm={3}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                  <TrendingUp color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    #{dashboardData?.rank || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Class Rank
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Current Module */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  📚 Current Module
                </Typography>
                
                {dashboardData?.currentModule ? (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      {dashboardData.currentModule.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {dashboardData.currentModule.description}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {dashboardData.currentModule.progress}%
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={dashboardData.currentModule.progress}
                      sx={{ mb: 2, height: 6, borderRadius: 3 }}
                    />
                    
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Assignment />}
                      sx={{ borderRadius: 2 }}
                    >
                      Continue Learning
                    </Button>
                  </Box>
                ) : (
                  <Box textAlign="center" py={3}>
                    <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No active module. Start a new one!
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 2 }}>
                      Browse Modules
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Upcoming Drills */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🚨 Upcoming Drills
                </Typography>
                
                {dashboardData?.upcomingDrills?.length > 0 ? (
                  <List dense>
                    {dashboardData.upcomingDrills.map((drill, index) => (
                      <ListItem key={index} divider={index < dashboardData.upcomingDrills.length - 1}>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={drill.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(drill.scheduledAt).toLocaleDateString()} at{' '}
                                {new Date(drill.scheduledAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                              <Chip
                                label={drill.type}
                                size="small"
                                color={drill.type === 'emergency' ? 'error' : 'primary'}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={3}>
                    <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No upcoming drills scheduled
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🏆 Recent Achievements
                </Typography>
                
                {dashboardData?.recentAchievements?.length > 0 ? (
                  <List dense>
                    {dashboardData.recentAchievements.map((achievement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={achievement.title}
                          secondary={achievement.description}
                        />
                        <Chip
                          label={`+${achievement.points}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={3}>
                    <Star sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Complete modules to earn achievements!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🚀 Quick Actions
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Assignment />}
                      sx={{ height: 60, flexDirection: 'column', gap: 1 }}
                    >
                      <span>Start Module</span>
                    </Button>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Warning />}
                      sx={{ height: 60, flexDirection: 'column', gap: 1 }}
                    >
                      <span>Emergency Guide</span>
                    </Button>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Groups />}
                      sx={{ height: 60, flexDirection: 'column', gap: 1 }}
                    >
                      <span>Practice Drill</span>
                    </Button>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      sx={{ height: 60, flexDirection: 'column', gap: 1 }}
                    >
                      <span>Leaderboard</span>
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
