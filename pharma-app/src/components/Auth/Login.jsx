import { Button, Container, Grid, Paper, TextField, Divider, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
import CountryCodeSelector from './CountryCodeSelector';

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

  // Mobile number validation
  const validateMobileNumber = (number) => {
    const mobileRegex = /^\d{8,15}$/; // Adjust based on your requirements
    return mobileRegex.test(number);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setMobileNumber(value);
    setMobileError(!validateMobileNumber(value) ? 'Please enter a valid mobile number' : '');
  };

  const handleCountryCodeChange = (code) => {
    setCountryCode(code);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setOtp(value);
    setOtpError(value.length !== 6 ? 'OTP must be 6 digits' : '');
  };

  const sendOtp = async () => {
    if (!mobileNumber || mobileError) {
      setLoginError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/users/send-otp', {
        phoneNumber: `${countryCode}${mobileNumber}` // Fixed template literal
      });
      setShowOtpField(true);
      setLoginError('');
    } catch {
      setLoginError('Failed to send OTP. Please try again.');
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
    try {
      const response = await axios.post('http://localhost:8080/api/users/verify-otp', {
        mobile: `${countryCode}${mobileNumber}`, // Fixed template literal
        otp
      });
      
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode role from token and redirect
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role;

      switch (userRole) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Customer':
          navigate('/customer');
          break;
        default:
          navigate('/unauthorized');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/google-auth', {
        credential: credentialResponse.credential
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/customer'); // Or based on user role
    } catch {
      setLoginError('Google authentication failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper className='paper mt-5 mb-5' elevation={3} style={{ padding: '20px' }}>
        <img src='/src/assets/logo.jpeg' alt='logo' style={{ display: 'block', width: '50px', margin: '10px auto' }} />
        <h2 className='text-center fw-bold'>Login</h2>
        
        {!showOtpField ? (
          <div>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
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
                margin='normal'
              />
            </Box>
            
            {loginError && (
              <Typography color="error" style={{ marginTop: '10px' }}>{loginError}</Typography>
            )}

            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={sendOtp}
              disabled={isLoading || !mobileNumber || Boolean(mobileError)}
              style={{ marginTop: '10px' }}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        ) : (
          <form onSubmit={verifyOtp}>
            <TextField
              label='Enter OTP'
              variant='outlined'
              fullWidth
              value={otp}
              onChange={handleOtpChange}
              error={Boolean(otpError)}
              helperText={otpError}
              margin='normal'
            />
            
            {loginError && (
              <Typography color="error" style={{ marginTop: '10px' }}>{loginError}</Typography>
            )}

            <Button
              variant='contained'
              color='primary'
              type='submit'
              fullWidth
              disabled={isLoading || !otp || Boolean(otpError)}
              style={{ marginTop: '10px' }}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        )}

        <Divider sx={{ my: 3 }}>OR</Divider>

        {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setLoginError('Google login failed')}
            width="100%"
          />
        </Box> */}
      </Paper>
    </Container>
  );
};

export default Login;