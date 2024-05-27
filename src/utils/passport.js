import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

// Google Strategy Configuration
export const initOauth = () => {
    console.log('init...');
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'http://localhost:3000/auth/google/callback',
                passReqToCallback: true,
            },
            function (request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
            })
    );
    passport.use(
        new LinkedInStrategy(
            {
                clientID: process.env.LINKEDIN_CLIENT_ID || '',
                clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
                callbackURL: 'http://localhost:3000/auth/linkedin/callback',
                passReqToCallback: true,
            },
            function (request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
            })
    );

    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (user, done) => {
        done(null, user);
    });
}

