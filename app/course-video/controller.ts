import { Request, Response } from "express";
import { errorReturn, successReturn } from "../../utils/response";
import { courseVideoSchema } from "../../schemas/courseVideoSchema";
import { zodErrorToString } from "../../utils/zodErrorToString";
import { db } from "../../utils/db";

// courseId : 66b365c93d3d0b52f1077a31

export const createCourseVideo = async (req: Request, res: Response) => {
    try {

        const { error, data } = courseVideoSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const courseVideo = await db.courseVideo.create({
            data: {
                ...data
            }
        })

        successReturn(res, "POST", courseVideo)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}