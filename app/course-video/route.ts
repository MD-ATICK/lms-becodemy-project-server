

import express from 'express';
import { createCourseVideo } from './controller';
const router = express.Router();

router.post('/create-video', createCourseVideo)


export default router;