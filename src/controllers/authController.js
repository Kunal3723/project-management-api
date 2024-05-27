import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateRegister, validateLogin, validateEmail } from '../utils/validator.js';
import passport from 'passport';
import dotenv from 'dotenv';
import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import transporter from '../config/mailConfig.js';
import { generateToken } from '../utils/helperFunctions.js';
import { CustomError } from '../utils/customError.js';
import { logger } from '../utils/logger.js';
import { clearCache } from '../utils/redis.js';

dotenv.config();
const { JWT_SECRET } = process.env;

// Register a new user
export const registerUser = async (req, res, next) => {
    try {
        const { error } = validateRegister(req.body);
        if (error) throw new CustomError(400, error.message);
        const isUserExists = await User.findOne({ where: { username: req.body.username } });
        if (isUserExists) {
            throw new CustomError(400, 'Username already exists!!');
        }
        await clearCache('users');
        const user = await User.create(req.body);
        logger.info(`User registered: ${user.username}`);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

// Login a user
export const loginUser = async (req, res, next) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) throw new CustomError(400, error.message);

        const user = await User.findOne({ where: { username: req.body.username } });

        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            throw new CustomError(400, 'Invalid username or password');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '6h' });
        logger.info(`User logged in: ${user.username}`);
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

// Google OAuth routes
export const googleOAuth = passport.authenticate('google', { scope: ['email', 'profile'] });

export const googleOAuthCallback = passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
});

export const linkedinOAuth = passport.authenticate('linkedin', { scope: ['email', 'profile'] });

export const linkedinOAuthCallback = passport.authenticate('linkedin', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
});

export const logout = (req, res, next) => {
    try {
        req.logout();
        req.session.destroy();
        logger.info('User logged out');
        res.send('Logged out!!');
    } catch (err) {
        next(err);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { error } = validateEmail(req.body);
        if (error) throw new CustomError(400, error.message);

        const { email } = req.body;
        const token = generateToken();
        const { username } = req.user;
        const user = await User.findOne({ where: { username: username } });
        await user.update({ emailId: email, emailVerificationToken: token });
        const verificationUrl = `http://localhost:3000/auth/verify-email/${token}`;
        const mailOptions = {
            from: 'dtom7628@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
        };
        await clearCache('users');
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                throw new Error(err.message);
            }
            logger.info(`Verification email sent to: ${email}`);
            res.status(200).send('Verification email sent.');
        });
    } catch (err) {
        next(err);
    }
};

export const verifyEmailToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ where: { emailVerificationToken: token } });

        if (!user) {
            throw new CustomError(400, 'Invalid token');
        }

        await user.update({ isEmailVerified: true });
        await clearCache('users');
        logger.info(`Email verified for user: ${user.username}`);
        res.status(200).send('Email successfully verified');
    } catch (err) {
        next(err);
    }
};

export const enable2FA = async (req, res, next) => {
    try {
        const { username } = req.body;

        // Find the user by username (you should use a database here)
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            throw new CustomError(400, 'Invalid username or password');
        }

        // Generate a secret key for the user
        const secret = speakeasy.generateSecret({ length: 20 });
        await user.update({ secret: secret.base32 });
        await clearCache('users');
        QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
            if (err) {
                throw new Error(err.message);
            }
            logger.info(`2FA enabled for user: ${username}`);
            // Send the QR code to the user
            res.send({ qrCode: image_data, secret: secret.base32 });
        });
    } catch (err) {
        next(err);
    }
};

export const verify2FA = async (req, res, next) => {
    try {
        const { username, token } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            throw new CustomError(400, 'Invalid username or password');
        }

        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (verified) {
            logger.info(`2FA verified for user: ${username}`);
            res.json({
                status: "success",
                message: "Authentication successful"
            });
        } else {
            throw new CustomError(401, 'Authentication failed');
        }
    } catch (err) {
        next(err);
    }
};
