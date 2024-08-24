import express from "express";
import { authorizeUser } from "../../middlewares/userAuth";
import { activateUser, auth, login, logout, register, socialLogin, updatePassword, updateProfile, users } from "./controller";

const router = express.Router()

router.get('/me', authorizeUser, auth)
router.post('/register', register)
router.get('/users', users)
router.post('/login', login)
router.post('/social', socialLogin)
router.put('/update-password', authorizeUser, updatePassword)
router.put('/update-profile', authorizeUser, updateProfile)
router.post('/login', login)
router.get('/logout', authorizeUser, logout)
router.post('/activate', activateUser)



export default router;