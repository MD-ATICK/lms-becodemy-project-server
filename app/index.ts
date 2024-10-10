import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import http from 'http';
import Redis from "ioredis";
import { initSocketServer } from '../socketServer';
import { rootGet } from '../utils/uploadImage';
const app = express()
const server = http.createServer(app)
const port = 9999

dotenv.config()
app.use(cors({ origin: [process.env.CLIENT_URL || 'http://localhost:9999'], credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
    secure: true,
})
// redos connect
export const redis: Redis = new Redis({
    host: 'redis-18821.c258.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 18821,
    password: 'v7IrVFa02XcbkbnxfC6ynVcFIPm2imok'
})


app.get('/', rootGet)
// app.post('/upload-image', uploadImage)

// app.use('/admin', adminRouter)
// app.use('/auth', userRouter)
// app.use('/course', courseRouter)
// app.use('/course-video', courseVideoRouter)
// app.use('/question', questionRouter)
// app.use('/review', reviewRouter)
// app.use('/order', orderRouter)
// app.use('/notification', notificationRouter)
// app.use('/layout', layoutRouter)


initSocketServer(server)
server.listen(port, () => {
    console.log("🟢 server listening on port : http://localhost:9999")
})

app.all("*", (req: Request, res: Response) => {
    const error = new Error(`Route ${req.originalUrl} is not found.`)
    res.status(404).send({ error: error.message })
})