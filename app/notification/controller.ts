import { Request, Response } from "express";
import { errorReturn, successReturn } from "../../utils/response";
import { db } from "../../utils/db";
import cron from 'node-cron'

export const listNotifications = async (req: Request, res: Response) => {
    try {

        const notifications = (await db.notification.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        }))

        successReturn(res, "GET", notifications)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const updateStatusAndGetListNotifications = async (req: Request, res: Response) => {
    try {

        const notification = await db.notification.findFirst({ where: { id: req.params.id } })
        if (!notification) throw new Error('no notification found!')

        await db.notification.update({
            where: { id: req.params.id },
            data: { status: "READ" }
        })

        const updatedNotification = await db.notification.findMany({ orderBy: { createdAt: "desc" } })

        successReturn(res, "UPDATE", updatedNotification)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

cron.schedule("0 0 0 * * *", async () => {

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    await db.notification.deleteMany({
        where: { status: "READ", createdAt: { lt: thirtyDaysAgo } },
    })
})