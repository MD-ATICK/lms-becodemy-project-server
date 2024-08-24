
import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { createOrder } from './controller';
const router = express.Router();

router.post('/create', authorizeUser, createOrder)


export default router;