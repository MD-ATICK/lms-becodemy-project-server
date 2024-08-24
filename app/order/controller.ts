import { Request, Response } from "express";
import { errorReturn, successReturn } from "../../utils/response";
import { orderSchema } from "../../schemas/orderSchema";
import { zodErrorToString } from "../../utils/zodErrorToString";
import { db } from "../../utils/db";
import { getUserById } from "../../utils/user";
import { getCourseById } from "../../utils/course";
import { sendMail } from "../../utils/mail";



export const createOrder = async (req: Request, res: Response) => {
    try {

        const { error, data } = orderSchema.safeParse(req.body)

        if (error) return zodErrorToString(error.errors)
        const { courseId } = data
        const userId = req.loggedUser?.id

        if (!req.loggedUser) throw new Error('unauthorized')

        const user = await db.user.findFirstOrThrow({ where: { id: userId }, include: { purchasedCourses: true } })
        const existenceCheck = user.purchasedCourses.find(course => course.courseId === courseId)

        if (existenceCheck) throw new Error('you already purchase this course!')

        const course = await getCourseById(courseId)

        const order = await db.order.create({
            data: {
                courseId,
                userId
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