import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { addBanner, addCategory, addFaq, createLayout, deleteCategory, deleteFaq, deleteLayoutsByNameAry, EditCategory, EditFaq, getActiveLayoutForClient, getAllLayout, getSingleLayout, setActiveLayout } from './controller';
const router = express.Router()



router.get('/listLayouts', authorizeUser, getAllLayout)
router.get('/single-layout/:id', authorizeUser, getSingleLayout)
router.put('/set-active-layout/:id', authorizeUser, setActiveLayout)

// # get active layout in client
router.get('/get-client-active-layout', getActiveLayoutForClient)

// layoutId : 66ba1949ea95c7fad9de94ca
// # creating things!
router.post('/createLayout', authorizeUser, createLayout)
router.delete('/deleteLayouts', authorizeUser, deleteLayoutsByNameAry)


router.post('/addFaq', authorizeUser, addFaq)
router.delete('/deleteFaq', authorizeUser, deleteFaq)
router.put('/editFaq', authorizeUser, EditFaq)
router.post('/addBanner', authorizeUser, addBanner)
router.post('/addCategory', authorizeUser, addCategory)
router.put('/editCategory', authorizeUser, EditCategory)
router.delete('/deleteCategory', authorizeUser, deleteCategory)

export default router;