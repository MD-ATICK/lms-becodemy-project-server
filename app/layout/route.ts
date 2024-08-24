import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { addBanner, addCategory, addFaq, createLayout, getActiveLayoutForClient, getAllLayout, getSingleLayout, setActiveLayout } from './controller';
const router = express.Router()



router.get('/listLayouts', authorizeUser, getAllLayout)
router.get('/single-layout/:id', authorizeUser, getSingleLayout)
router.put('/set-active-layout/:id', authorizeUser, setActiveLayout)

// # get active layout in client
router.get('/client-active-layout', authorizeUser, getActiveLayoutForClient)

// layoutId : 66ba1949ea95c7fad9de94ca
// # creating things!
router.post('/createLayout', authorizeUser, createLayout)
router.post('/addFaq', authorizeUser, addFaq)
router.post('/addBanner', authorizeUser, addBanner)
router.post('/addCategory', authorizeUser, addCategory)

export default router;