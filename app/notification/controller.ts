import { Request, Response } from "express";
import cron from 'node-cron';
import { db } from "../../utils/db";
import { errorReturn, successReturn } from "../../utils/response";

export const listNotifications = async (req: Request, res: Response) => {
    try {

        const notifications = await db.notification.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        })

        successReturn(res, "GET", notifications)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const updateStatusAndGetListNotifications = async (req: Request, res: Response) => {
    try {

        const notification = await db.notification.findFirst({ where: { id: req.params.id } })
        if (!notification) throw new Error('no notification found!')

        const updateNotification = await db.notification.update({
            where: { id: req.params.id },
            data: { status: "READ" }
        })

        successReturn(res, "UPDATE", updateNotification)
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