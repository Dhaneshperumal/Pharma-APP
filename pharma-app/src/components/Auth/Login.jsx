import { Button, Container, Paper, TextField, Divider, Typography, Box, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mobile number validation (8-15 digits)
  const validateMobileNumber = (number) => /^\d{8,15}$/.test(number);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobileNumber(value);
    setMobileError(!validateMobileNumber(value) ? 'Enter 8-15 digit number' : '');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
    setOtpError(value.length !== 6 ? 'OTP must be 6 digits' : '');
  };

  const sendOtp = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setMobileError('Invalid mobile number');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/users/send-otp', {
        phoneNumber: `${countryCode}${mobileNumber}`
      });
      setShowOtpField(true);
      setLoginError('');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError('Invalid OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:8080/api/users/verify-otp', {
        mobile: `${countryCode}${mobileNumber}`,
        otp
      });

      localStorage.setItem('token', data.token);
      const { role } = JSON.parse(atob(data.token.split('.')[1]));
      
      navigate(role === 'Admin' ? '/admin' : '/customer');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/users/google-auth', {
        credential: credentialResponse.credential
      });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 5, mb: 5 }}>
        <img 
          src="/src/assets/logo.jpeg" 
          alt="logo" 
          style={{ display: 'block', width: 50, margin: '10px auto' }} 
        />

        {!showOtpField ? (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                sx={{ width: 100 }}
              >
                <MenuItem value="+1">+1 (US)</MenuItem>
                <MenuItem value="+91">+91 (IN)</MenuItem>
                <MenuItem value="+44">+44 (UK)</MenuItem>
              </TextField>
              <TextField
                label="Mobile Number"
                value={mobileNumber}
                onChange={handleMobileChange}
                error={!!mobileError}
                helperText={mobileError}
                fullWidth
              />
            </Box>

            {loginError && <Typography color="error">{loginError}</Typography>}

            <Button
              fullWidth
              variant="contained"
              onClick={sendOtp}
              disabled={isLoading || !mobileNumber || !!mobileError}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <form onSubmit={verifyOtp}>
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              error={!!otpError}
              helperText={otpError}
              fullWidth
              sx={{ mb: 2 }}
            />

            {loginError && <Typography color="error">{loginError}</Typography>}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading || !otp || !!otpError}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        )}

        <Divider sx={{ my: 3 }}>OR</Divider>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setLoginError('Google login failed')}
          width="100%"
        />
      </Paper>
    </Container>
  );
};

export default Login;