
import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { createOrder, newPayment, sendStripePublishableKey } from './controller';
const router = express.Router();

router.post('/create', authorizeUser, createOrder)
router.get('/payment/stripe_publishable_key', sendStripePublishableKey)
router.post('/payment', authorizeUser, newPayment)


export default router;