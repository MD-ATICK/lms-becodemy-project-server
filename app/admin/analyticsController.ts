import { Request, Response } from "express"
import { redis } from ".."
import { last12MonthsData, last24hoursData, last30DaysData } from "../../utils/analytics"
import { db } from "../../utils/db"
import { errorReturn, successReturn } from "../../utils/response"


// course analytics ------------
export const getLast12MonthsDataOfCourse = async (req: Request, res: Response) => {
    try {

        const TwelveMonthsCourseData = await redis.get('12MonthsCourseData')
        if (TwelveMonthsCourseData) {
            return successReturn(res, "GET", JSON.parse(TwelveMonthsCourseData))
        }
        const data = await last12MonthsData(db.course)
        await redis.setex('12MonthsCourseData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export const getLast30DaysDataOfCourse = async (req: Request, res: Response) => {
    try {
        const last30DaysRedisData = await redis.get('last30DaysCourseData')
        if (last30DaysRedisData) {
            return successReturn(res, "GET", JSON.parse(last30DaysRedisData))
        }
        const data = await last30DaysData(db.course)
        await redis.setex('last30DaysCourseData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getLast24HoursDataOfCourse = async (req: Request, res: Response) => {
    try {
        const last24hoursRedisData = await redis.get('last24hoursCourseData')
        if (last24hoursRedisData) {
            return successReturn(res, "GET", JSON.parse(last24hoursRedisData))
        }
        const data = await last24hoursData(db.course)
        await redis.setex('last24hoursCourseData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


// User analytics ------------

export const getLast12MonthsDataOfUser = async (req: Request, res: Response) => {
    try {
        const last12MonthsUserRedisData = await redis.get('last12MonthsUserData')
        if (last12MonthsUserRedisData) {
            return successReturn(res, "GET", JSON.parse(last12MonthsUserRedisData))
        }
        const data = await last12MonthsData(db.user)
        await redis.setex('last12MonthsUserData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getLast30DaysDataOfUser = async (req: Request, res: Response) => {
    try {
        const last30DaysRedisUserData = await redis.get('last30DaysUserData')
        if (last30DaysRedisUserData) {
            console.log('redis user data')
            return successReturn(res, "GET", JSON.parse(last30DaysRedisUserData))
        }
        const data = await last30DaysData(db.user)
        await redis.setex('last30DaysUserData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getLast24HoursDataOfUser = async (req: Request, res: Response) => {
    try {
        const last24hoursUserRedisData = await redis.get('last24hoursUserData')
        if (last24hoursUserRedisData) {
            return successReturn(res, "GET", JSON.parse(last24hoursUserRedisData))
        }
        const data = await last24hoursData(db.user)
        await redis.setex('last24hoursUserData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

// Order analytics ------------

export const getLast12MonthsDataOfOrder = async (req: Request, res: Response) => {
    try {
        const last12MonthsOrderRedisData = await redis.get('last12MonthsOrderData')
        if (last12MonthsOrderRedisData) {
            return successReturn(res, "GET", JSON.parse(last12MonthsOrderRedisData))
        }
        const data = await last12MonthsData(db.order)
        await redis.setex('last12MonthsOrderData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export const getLast30DaysDataOfOrder = async (req: Request, res: Response) => {
    try {

        const last30DaysOrderRedisData = await redis.get('last30DaysOrderData')
        if (last30DaysOrderRedisData) {
            return successReturn(res, "GET", JSON.parse(last30DaysOrderRedisData))
        }
        const data = await last30DaysData(db.order)
        await redis.setex('last30DaysOrderData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export const getLast24HoursDataOfOrder = async (req: Request, res: Response) => {
    try {
        const last24hoursOrderRedisData = await redis.get('last24hoursOrderData')
        if (last24hoursOrderRedisData) {
            return successReturn(res, "GET", JSON.parse(last24hoursOrderRedisData))
        }
        const data = await last24hoursData(db.order)
        await redis.setex('last24hoursOrderData', 60, JSON.stringify(data))
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
