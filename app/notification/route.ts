import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { listNotifications, updateStatusAndGetListNotifications } from './controller';
const router = express.Router()

router.get('/listNotifications', authorizeUser, listNotifications)
router.put('/updateStatus/:id', authorizeUser, updateStatusAndGetListNotifications)


export default router;