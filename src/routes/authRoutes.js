import express from 'express';
import { enable2FA, googleOAuth, googleOAuthCallback, linkedinOAuth, linkedinOAuthCallback, loginUser, logout, registerUser, verify2FA, verifyEmail, verifyEmailToken } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

authRouter.post('/verify-email', authenticate, verifyEmail);
authRouter.get('/verify-email/:token', verifyEmailToken);
authRouter.post('/2fa/enable', enable2FA);
authRouter.post('/2fa/verify', verify2FA);

authRouter.get('/oauth/google', googleOAuth);
authRouter.get('/google/callback', googleOAuthCallback);

authRouter.get('/oauth/linkedin', linkedinOAuth);
authRouter.get('/linkedin/callback', linkedinOAuthCallback);

authRouter.get('/logout', logout);
authRouter.get('/failure', (req, res) => { 
  res.send('Login failed')
})

export default authRouter;