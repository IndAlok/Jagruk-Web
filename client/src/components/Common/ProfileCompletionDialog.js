import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { CheckCircle, Person, Work, School } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const ProfileCompletionDialog = ({ open, user, onComplete, onSkip }) => {
  const { completeGoogleProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    role: '',
    phone: '',
    address: '',
    // Student fields
    admissionNumber: '',
    class: '',
    rollNumber: '',
    parentContact: '',
    // Staff fields
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    emergencyContact: '',
    // Admin fields
    adminId: '',
    schoolName: '',
    district: '',
    state: '',
    schoolId: ''
  });

  const steps = ['Select Role', 'Basic Info', 'Role-Specific Info'];

  const handleNext = () => {
    if (activeStep === 0 && !profileData.role) {
      setError('Please select your role');
      return;
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields based on role
      const requiredFields = ['phone', 'address'];
      
      if (profileData.role === 'student') {
        requiredFields.push('admissionNumber', 'class', 'rollNumber', 'parentContact');
      } else if (profileData.role === 'staff') {
        requiredFields.push('employeeId', 'department', 'designation');
      } else if (profileData.role === 'admin') {
        requiredFields.push('adminId', 'schoolName', 'district', 'state');
      }

      const missingFields = requiredFields.filter(field => !profileData[field]);
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      await completeGoogleProfile(user.id, profileData.role, profileData);
      onComplete();
    } catch (error) {
      setError(error.message || 'Failed to complete profile. Please try again.');
      console.error('Profile completion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              What is your role?
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please select your role to customize your experience
            </Typography>
            
            <Grid container spacing={2}>
              {[
                { value: 'student', label: 'Student', icon: <School />, description: 'Access learning materials and participate in drills' },
                { value: 'staff', label: 'Staff', icon: <Work />, description: 'Manage students and conduct safety activities' },
                { value: 'admin', label: 'Admin', icon: <Person />, description: 'Oversee the entire safety management system' }
              ].map((role) => (
                <Grid item xs={12} sm={4} key={role.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: profileData.role === role.value ? 2 : 1,
                      borderColor: profileData.role === role.value ? 'primary.main' : 'divider',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => handleInputChange('role', role.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box mb={2}>
                        {role.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {role.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please provide your contact information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91-9876543210"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Enter your full address"
                  required
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} Information
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please provide role-specific information
            </Typography>
            
            <Grid container spacing={3}>
              {profileData.role === 'student' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Admission Number"
                      value={profileData.admissionNumber}
                      onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Class"
                      value={profileData.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      placeholder="e.g., 10-A"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      value={profileData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Parent Contact"
                      value={profileData.parentContact}
                      onChange={(e) => handleInputChange('parentContact', e.target.value)}
                      placeholder="+91-9876543210"
                      required
                    />
                  </Grid>
                </>
              )}

              {profileData.role === 'staff' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={profileData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={profileData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Qualification"
                      value={profileData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience (years)"
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      value={profileData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    />
                  </Grid>
                </>
              )}

              {profileData.role === 'admin' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Admin ID"
                      value={profileData.adminId}
                      onChange={(e) => handleInputChange('adminId', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="School Name"
                      value={profileData.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="District"
                      value={profileData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="School ID"
                      value={profileData.schoolId}
                      onChange={(e) => handleInputChange('schoolId', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <CheckCircle sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Complete Your Profile
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Welcome! Let's set up your profile to get started
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onSkip} disabled={loading}>
          Skip for Now
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext} disabled={loading}>
            Next
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleComplete} 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Completing...' : 'Complete Profile'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProfileCompletionDialog;
