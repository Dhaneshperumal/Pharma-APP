import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const PORT = 8080;
const GOOGLE_CLIENT_ID = (typeof process !== 'undefined' && process.env.GOOGLE_CLIENT_ID) || '448185632803-o10moscguqnt788vorlr5e3o68gqq2vb.apps.googleusercontent.com';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Google Auth Endpoint - Updated with better error handling
app.post('/api/users/google-auth', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'No credential provided' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    }).catch(err => {
      console.error('Token verification error:', err);
      throw new Error('Invalid token');
    });
    
    const payload = ticket.getPayload();
    
    if (!payload.email_verified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const token = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: 'Customer'
      },
      (typeof process !== 'undefined' && process.env.JWT_SECRET) || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({ 
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
      message: 'Authentication failed',
      error: error.message 
    });
  }
});

// ... rest of your endpoints ...

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});