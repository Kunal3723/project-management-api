// const authRoutes = require('./routes/authRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const userRoutes = require('./routes/userRoutes');
// const { errorHandler } = require('./middlewares/errorHandler');
import express from 'express';
import session from 'express-session';
import { initOauth } from './utils/passport.js';
import { sequelize } from './models/index.js';
import cors from 'cors'
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import passport from 'passport';
import { authenticate } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { httpLoggerMiddleware } from './middlewares/httpMiddleware.js';
import { logger } from './utils/logger.js';

initOauth();

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({ secret: 'project', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send(`
    <a href="/auth/oauth/google">Authenticate with Google</a>
    <a href="/auth/oauth/linkedin">Authenticate with Linkedin</a>
    `);
});
app.get('/protected', authenticate, (req, res) => {
    res.send('Hello');
})

app.use(httpLoggerMiddleware);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/projects', projectRouter);

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    sequelize.sync()
        .then(async () => {
            console.log('Database synced successfully');
        })
        .catch((err) => {
            console.error('Error syncing database:', err);
        });
})