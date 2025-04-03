import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import speakeasy from 'speakeasy';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '448185632803-o10moscguqnt788vorlr5e3o68gqq2vb.apps.googleusercontent.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_jwt_secret_here';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const otpStore = new Map();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Google Auth Endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ 
        success: false,
        message: 'No credential provided' 
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload.email_verified) {
      return res.status(403).json({ 
        success: false,
        message: 'Email not verified' 
      });
    }

    const token = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: 'Customer'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({ 
      success: true,
      token,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
});

// OTP Endpoints
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number is required' 
      });
    }

    // Generate OTP
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 300 // 5 minutes
    });

    // Store OTP (in production, use Redis or database)
    otpStore.set(phoneNumber, {
      secret: secret.base32,
      token,
      expires: Date.now() + 300000 // 5 minutes
    });

    console.log(`OTP for ${phoneNumber}: ${token}`); // Remove in production

    return res.status(200).json({ 
      success: true,
      message: 'OTP sent successfully',
      // Only return OTP in development
      otp: process.env.NODE_ENV === 'development' ? token : null
    });
    
  } catch (error) {
    console.error('OTP generation error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to generate OTP',
      error: error.message 
    });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number and OTP are required' 
      });
    }

    const storedOtp = otpStore.get(phoneNumber);
    
    if (!storedOtp) {
      return res.status(404).json({ 
        success: false,
        message: 'OTP not found or expired' 
      });
    }

    if (Date.now() > storedOtp.expires) {
      otpStore.delete(phoneNumber);
      return res.status(401).json({ 
        success: false,
        message: 'OTP expired' 
      });
    }

    const isValid = speakeasy.totp.verify({
      secret: storedOtp.secret,
      encoding: 'base32',
      token: otp,
      window: 2, // Allows 1 step before/after current time
      step: 300 // 5 minutes
    });

    if (!isValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    // OTP is valid - generate JWT
    otpStore.delete(phoneNumber);
    
    const token = jwt.sign(
      { phoneNumber, role: 'Customer' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      success: true,
      token,
      user: { phoneNumber }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'OTP verification failed',
      error: error.message 
    });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
});