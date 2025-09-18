import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Badge as BadgeIcon,
  ErrorOutline as ErrorOutlineIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Profile = ({ user: passedUser, onClose, onBack }) => {
  const { currentUser, updateUserProfile, getUserProfile } = useAuth();
  
  // Use passed user or current user from context
  const user = passedUser || currentUser;
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    
    // Student specific
    admissionNumber: '',
    class: '',
    rollNumber: '',
    parentContact: '',
    subjects: [],
    
    // Staff specific  
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    emergencyContact: '',
    
    // Admin specific
    adminId: '',
    schoolName: '',
    district: '',
    state: '',
    
    // Common
    schoolId: '',
    profilePhoto: '',
    
    // Preferences
    notifications: {
      email: true,
      sms: true,
      push: true,
      emergencyAlerts: true,
      drillReminders: true,
      moduleUpdates: true
    },
    
    // Security
    twoFactorEnabled: false,
    lastLogin: '',
    accountStatus: 'active'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if profile is incomplete and show completion dialog
  useEffect(() => {
    if (profileData && isGoogleUser() && !isProfileComplete()) {
      // Only show dialog if user has not completed their profile
      setCompletionDialogOpen(true);
    }
  }, [profileData]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const profile = await getUserProfile();
      if (profile && profile.success) {
        const userData = profile.data;
        setProfileData(userData);
        setOriginalData(userData);
        
        // Populate form with existing data
        setFormData({
          ...formData,
          name: userData.name || user.name || '',
          email: userData.email || user.email || '',
          phone: userData.phone || userData.contactNumber || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          admissionNumber: userData.admissionNumber || '',
          class: userData.class || '',
          rollNumber: userData.rollNumber || '',
          parentContact: userData.parentContact || '',
          subjects: userData.subjects || [],
          employeeId: userData.employeeId || '',
          department: userData.department || '',
          designation: userData.designation || '',
          qualification: userData.qualification || '',
          experience: userData.experience || '',
          emergencyContact: userData.emergencyContact || '',
          adminId: userData.adminId || '',
          schoolName: userData.schoolName || '',
          district: userData.district || '',
          state: userData.state || '',
          schoolId: userData.schoolId || '',
          profilePhoto: userData.profilePhoto || userData.photoURL || user.photoURL || '',
          notifications: userData.notifications || formData.notifications,
          twoFactorEnabled: userData.twoFactorEnabled || false,
          lastLogin: userData.lastLogin || '',
          accountStatus: userData.status || 'active'
        });
      } else {
        // If no profile data, use user data from auth
        populateFromUser();
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      populateFromUser();
    } finally {
      setLoading(false);
    }
  };

  const populateFromUser = () => {
    if (!user) return;
    
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      profilePhoto: user.photoURL || '',
      accountStatus: user.status || 'active'
    }));
  };

  const isGoogleUser = () => {
    return user?.provider === 'google' || user?.email?.includes('gmail') || user?.photoURL;
  };

  const isProfileComplete = () => {
    const requiredFields = getRequiredFieldsByRole();
    return requiredFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });
  };

  const getRequiredFieldsByRole = () => {
    const baseFields = ['name', 'phone', 'address'];
    
    switch (user?.role) {
      case 'student':
        return [...baseFields, 'class', 'admissionNumber', 'parentContact', 'dateOfBirth'];
      case 'staff':
        return [...baseFields, 'employeeId', 'department', 'designation', 'emergencyContact'];
      case 'admin':
        return [...baseFields, 'adminId', 'schoolName', 'district', 'state'];
      default:
        return baseFields;
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = getRequiredFieldsByRole();
    const completedFields = requiredFields.filter(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleEdit = () => {
    setEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        profilePhoto: formData.profilePhoto,
        notifications: formData.notifications,
        twoFactorEnabled: formData.twoFactorEnabled
      };

      // Add role-specific fields
      if (user?.role === 'student') {
        Object.assign(updateData, {
          admissionNumber: formData.admissionNumber,
          class: formData.class,
          rollNumber: formData.rollNumber,
          parentContact: formData.parentContact,
          subjects: formData.subjects
        });
      } else if (user?.role === 'staff') {
        Object.assign(updateData, {
          employeeId: formData.employeeId,
          department: formData.department,
          designation: formData.designation,
          qualification: formData.qualification,
          experience: formData.experience,
          emergencyContact: formData.emergencyContact
        });
      } else if (user?.role === 'admin') {
        Object.assign(updateData, {
          adminId: formData.adminId,
          schoolName: formData.schoolName,
          district: formData.district,
          state: formData.state
        });
      }

      const result = await updateUserProfile(updateData);
      if (result.success) {
        setEditing(false);
        setOriginalData({ ...formData });
        setCompletionDialogOpen(false);
        toast.success('Profile updated successfully!');
        await loadProfileData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Call API to change password
      const result = await updateUserProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Password updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Convert to base64 for preview (in real app, upload to Firebase Storage)
    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange('profilePhoto', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      {/* Profile Photo */}
      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              editing ? (
                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </IconButton>
              ) : null
            }
          >
            <Avatar
              src={formData.profilePhoto}
              alt={formData.name}
              sx={{ 
                width: 120, 
                height: 120,
                border: '4px solid',
                borderColor: 'primary.main'
              }}
            >
              {formData.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Badge>
          
          {isGoogleUser() && (
            <Chip
              icon={<GoogleIcon />}
              label="Google Account"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Grid>

      {/* Basic Information */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!editing}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              disabled // Email should not be editable
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!editing}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!editing}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              disabled={!editing}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!editing}
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderRoleSpecificInfo = () => {
    switch (user?.role) {
      case 'student':
        return renderStudentInfo();
      case 'staff':
        return renderStaffInfo();
      case 'admin':
        return renderAdminInfo();
      default:
        return null;
    }
  };

  const renderStudentInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Admission Number"
          value={formData.admissionNumber}
          onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Class"
          value={formData.class}
          onChange={(e) => handleInputChange('class', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Roll Number"
          type="number"
          value={formData.rollNumber}
          onChange={(e) => handleInputChange('rollNumber', e.target.value)}
          disabled={!editing}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Parent Contact"
          value={formData.parentContact}
          onChange={(e) => handleInputChange('parentContact', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="School ID"
          value={formData.schoolId}
          onChange={(e) => handleInputChange('schoolId', e.target.value)}
          disabled={!editing}
        />
      </Grid>
    </Grid>
  );

  const renderStaffInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Employee ID"
          value={formData.employeeId}
          onChange={(e) => handleInputChange('employeeId', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Department"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <WorkIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Designation"
          value={formData.designation}
          onChange={(e) => handleInputChange('designation', e.target.value)}
          disabled={!editing}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Qualification"
          value={formData.qualification}
          onChange={(e) => handleInputChange('qualification', e.target.value)}
          disabled={!editing}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Experience (Years)"
          type="number"
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          disabled={!editing}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Emergency Contact"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="School ID"
          value={formData.schoolId}
          onChange={(e) => handleInputChange('schoolId', e.target.value)}
          disabled={!editing}
        />
      </Grid>
    </Grid>
  );

  const renderAdminInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Admin ID"
          value={formData.adminId}
          onChange={(e) => handleInputChange('adminId', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="School Name"
          value={formData.schoolName}
          onChange={(e) => handleInputChange('schoolName', e.target.value)}
          disabled={!editing}
          InputProps={{
            startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="District"
          value={formData.district}
          onChange={(e) => handleInputChange('district', e.target.value)}
          disabled={!editing}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          disabled={!editing}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="School ID"
          value={formData.schoolId}
          onChange={(e) => handleInputChange('schoolId', e.target.value)}
          disabled={!editing}
        />
      </Grid>
    </Grid>
  );

  const renderPreferences = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        <List>
          {Object.entries({
            email: 'Email Notifications',
            sms: 'SMS Notifications', 
            push: 'Push Notifications',
            emergencyAlerts: 'Emergency Alerts',
            drillReminders: 'Drill Reminders',
            moduleUpdates: 'Module Updates'
          }).map(([key, label]) => (
            <ListItem key={key}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary={label} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications[key] || false}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    disabled={!editing}
                  />
                }
                label=""
              />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );

  const renderSecurity = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Security
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="Two-Factor Authentication"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add an extra layer of security to your account
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => setShowPasswordDialog(true)}
              disabled={isGoogleUser()}
            >
              Change Password
            </Button>
            
            {isGoogleUser() && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Password change is managed through your Google account
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Account Status: <Chip 
                  label={formData.accountStatus} 
                  color={formData.accountStatus === 'active' ? 'success' : 'warning'}
                  size="small"
                />
              </Typography>
              {formData.lastLogin && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Last Login: {new Date(formData.lastLogin).toLocaleString()}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading && !profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {(onBack || onClose) && (
                <IconButton 
                  onClick={onBack || onClose}
                  sx={{ mr: 1 }}
                  size="large"
                >
                  <CancelIcon />
                </IconButton>
              )}
              <Typography variant="h4" fontWeight="bold">
                My Profile
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!editing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Profile Completion Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Profile Completion
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getCompletionPercentage()}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getCompletionPercentage()} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
          >
            <Tab label="Basic Information" />
            <Tab label={`${user?.role?.charAt(0)?.toUpperCase()}${user?.role?.slice(1)} Details`} />
            <Tab label="Preferences" />
            <Tab label="Security" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tabValue}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tabValue === 0 && renderBasicInfo()}
                {tabValue === 1 && renderRoleSpecificInfo()}
                {tabValue === 2 && renderPreferences()}
                {tabValue === 3 && renderSecurity()}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Paper>

        {/* Profile Completion Dialog */}
        <Dialog
          open={completionDialogOpen}
          onClose={() => !editing && setCompletionDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Complete Your Profile
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              We noticed you signed in with Google. Please complete your profile to get the best experience.
            </Alert>
            
            <Typography variant="body1" gutterBottom>
              Your profile is {getCompletionPercentage()}% complete. Please fill in the following required information:
            </Typography>
            
            <List dense>
              {getRequiredFieldsByRole()
                .filter(field => !formData[field] || formData[field].toString().trim() === '')
                .map(field => (
                  <ListItem key={field}>
                    <ListItemIcon>
                      <ErrorOutlineIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} />
                  </ListItem>
                ))
              }
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCompletionDialogOpen(false)}>
              Later
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setEditing(true);
                setCompletionDialogOpen(false);
              }}
            >
              Complete Now
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
            >
              {loading ? <CircularProgress size={20} /> : 'Change Password'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Profile;
