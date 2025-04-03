import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {
  Button,
  Container,
  Paper,
  TextField,
  Divider,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import CountryCodeSelector from './CountryCodeSelector';

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const GOOGLE_CLIENT_ID = '448185632803-o10moscguqnt788vorlr5e3o68gqq2vb.apps.googleusercontent.com';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const validateMobileNumber = (number) => {
    const mobileRegex = /^\d{8,15}$/;
    return mobileRegex.test(number);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobileNumber(value);
    setMobileError(validateMobileNumber(value) ? '' : 'Please enter a valid mobile number');
  };

  const handleCountryCodeChange = (code) => {
    setCountryCode(code);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
    setOtpError(value.length === 6 ? '' : 'OTP must be 6 digits');
  };

  const sendOtp = async () => {
    if (!mobileNumber || mobileError) {
      setLoginError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    setLoginError('');
    
    try {
      const fullNumber = `${countryCode}${mobileNumber}`;
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phoneNumber: fullNumber
      });

      if (response.data.success) {
        setShowOtpField(true);
        setOtpCountdown(120); // 2 minutes countdown
        if (response.data.otp) {
          console.log('Development OTP:', response.data.otp);
        }
      } else {
        setLoginError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otpError) {
      setLoginError('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    setLoginError('');
    
    try {
      const fullNumber = `${countryCode}${mobileNumber}`;
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phoneNumber: fullNumber,
        otp
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setLoginError(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        credential: credentialResponse.credential
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setLoginError(response.data.message || 'Google authentication failed');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setLoginError('Google login failed. Please try again or use another method.');
    console.error('Google login failed');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <img 
            src='/logo.png' 
            alt='Company Logo' 
            style={{ width: 60, height: 60, objectFit: 'contain' }} 
          />
          <Typography variant="h5" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue to your account
          </Typography>
        </Box>
        
        {loginError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError}
          </Alert>
        )}

        {!showOtpField ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CountryCodeSelector 
                value={countryCode}
                onChange={handleCountryCodeChange}
              />
              <TextField
                label='Mobile Number'
                variant='outlined'
                fullWidth
                value={mobileNumber}
                onChange={handleMobileChange}
                error={Boolean(mobileError)}
                helperText={mobileError}
                placeholder='1234567890'
              />
            </Box>

            <Button
              variant='contained'
              fullWidth
              onClick={sendOtp}
              disabled={isLoading || !mobileNumber || Boolean(mobileError)}
              sx={{ mt: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={verifyOtp}>
            <TextField
              label='Enter OTP'
              variant='outlined'
              fullWidth
              value={otp}
              onChange={handleOtpChange}
              error={Boolean(otpError)}
              helperText={otpError}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 6 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {otpCountdown > 0 ? `Resend OTP in ${otpCountdown}s` : ''}
              </Typography>
              <Button
                size="small"
                onClick={sendOtp}
                disabled={otpCountdown > 0 || isLoading}
              >
                Resend OTP
              </Button>
            </Box>

            <Button
              variant='contained'
              type='submit'
              fullWidth
              disabled={isLoading || !otp || Boolean(otpError)}
              sx={{ py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </GoogleOAuthProvider>
          
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;