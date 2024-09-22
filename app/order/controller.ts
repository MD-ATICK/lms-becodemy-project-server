import dotenv from 'dotenv';
import { Request, Response } from "express";
import { orderSchema } from "../../schemas/orderSchema";
import { getCourseById } from "../../utils/course";
import { db } from "../../utils/db";
import { sendMail } from "../../utils/mail";
import { errorReturn, successReturn } from "../../utils/response";
import { zodErrorToString } from "../../utils/zodErrorToString";
dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


export const createOrder = async (req: Request, res: Response) => {
    try {

        const { error, data } = orderSchema.safeParse(req.body)

        if (error) return zodErrorToString(error.errors)
        const { courseId, payment_info } = data
        const userId = req.loggedUser?.id

        if (payment_info?.id) {
            const paymentIntent = await stripe.paymentIntents.retrieve(payment_info.id)

            if (paymentIntent.status !== 'succeeded') {
                throw new Error('payment retrieve failed')
            }
        }

        if (!req.loggedUser) throw new Error('unauthorized')

        const user = await db.user.findFirstOrThrow({ where: { id: userId }, include: { purchasedCourses: true } })
        const existenceCheck = user.purchasedCourses.find(course => course.courseId === courseId)

        if (existenceCheck) throw new Error('you already purchase this course!')

        const course = await getCourseById(courseId)

        const order = await db.order.create({
            data: {
                courseId,
                userId,
                paymentInfo: payment_info
            },
            include: {
                user: true,
                course: true
            }
        })

        try {
            await sendMail(order, user.email, "your order has been placed!", "order-placed.ejs")
        } catch (error) {
            throw new Error('failed to send mail!');
        }

        const notification = await db.notification.create({
            data: {
                userId: user.id,
                title: "New Order Placed.",
                message: `You have a new order of ${course.name}`
            }
        })


        successReturn(res, "POST", { order, notification })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const sendStripePublishableKey = async (req: Request, res: Response) => {
    try {
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY
        if (!publishableKey) throw new Error('no publishable key!')
        successReturn(res, "GET", { publishableKey })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const newPayment = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body
        if (!amount) throw new Error(`Invalid amount`)
        const currency = "USD"
        const company = "E_learning"


        const myPayment = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                company,
            },
            automatic_payment_methods: {
                enabled: true
            }
        })

        successReturn(res, "POST", { client_secret: myPayment.client_secret })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
