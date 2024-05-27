import express from 'express'
import { getAllUsers } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const userRouter = express.Router();

userRouter.get('/', authenticate, authorize(['SuperAdmin']), getAllUsers);

export default userRouter;