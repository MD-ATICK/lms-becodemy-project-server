import dotenv from 'dotenv'
import { Request, Response } from "express"
import { redis } from '..'
import { courseSchema } from "../../schemas/courseSchema"
import { getCourseById, selectData } from '../../utils/course'
import { db } from "../../utils/db"
import { errorReturn, successReturn } from "../../utils/response"
import { zodErrorToString } from "../../utils/zodErrorToString"

dotenv.config()


export const createCourse = async (req: Request, res: Response) => {
    try {
        const { data, error } = courseSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        if (!req.loggedUser) throw new Error(' unauthorized access!')


        const newCourse = await db.course.create({
            data: {
                ...data,
                userId: req.loggedUser?.id,
                coursesVideos: {
                    create: data.courseVideos
                }
            },
            include: {
                coursesVideos: true
            }
        })

        successReturn(res, "POST", newCourse)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const editCourse = async (req: Request, res: Response) => {
    try {
        const { data, error } = courseSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)
        const id = req.params.id

        if (!req.loggedUser || !id) throw new Error(' unauthorized access!')
        await getCourseById(id)

        const updateCourse = await db.course.update({
            where: { id },
            data: {
                ...data
            }
        })

        successReturn(res, "UPDATE", updateCourse)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}



export const singleCourse = async (req: Request, res: Response) => {
    try {
        const selectValue = selectData()
        const courseId = req.params.id;
        const findRedisCourse = await redis.get(courseId)


        if (findRedisCourse) {
            return successReturn(res, "GET", JSON.parse(findRedisCourse))
        }

        const course = await db.course.findFirstOrThrow({
            where: { id: courseId },
            select: {
                ...selectValue,
            }
        })

        if (!course) {
            throw new Error("Course not found!")
        }
        // todo : extend this for ratings. -> source - prisma with ts project. 2 

        await redis.setex(courseId, process.env.REDIS_COURSE_TIME || 5, JSON.stringify(course)) // for 1 hours

        successReturn(res, "GET", course)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const allCourses = async (req: Request, res: Response) => {
    try {

        const findRedisAllCourses = await redis.get('courses')
        if (findRedisAllCourses) {
            return successReturn(res, "GET", JSON.parse(findRedisAllCourses))
        }

        const selectValue = selectData()
        const courses = await db.course.findMany({
            select: {
                ...selectValue
            }
        })

        if (!courses) {
            throw new Error("Course not found!")
        }

        await redis.setex('courses', process.env.REDIS_COURSE_TIME || 5, JSON.stringify(courses))

        successReturn(res, "GET", courses)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}



// ✅ get course content - only for purchase user.

export const courseByPurchaseUser = async (req: Request, res: Response) => {
    try {

        const courseId = req.params.id
        if (!req.loggedUser || !courseId) throw new Error('unauthenticated')

        const { purchasedCourses } = await db.user.findFirstOrThrow({
            where: { id: req.loggedUser.id },
            select: {
                id: true,
                role: true,
                purchasedCourses: {
                    select: {
                        id: true,
                        course: {
                            select: {
                                id: true,
                                coursesVideos: true
                            }
                        }
                    }
                },
            }
        })

        const isCoursePurchased = purchasedCourses.find(course => course.id === courseId)
        if (!isCoursePurchased?.course) throw new Error('you have not access at this course!')

        successReturn(res, "GET", isCoursePurchased.course.coursesVideos)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


// just testing purpose

export const testFunc = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

