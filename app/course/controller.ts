import dotenv from 'dotenv'
import { Request, Response } from "express"
import { z } from 'zod'
import { redis } from '..'
import { courseSchema } from "../../schemas/courseSchema"
import { courseVideoSchema } from '../../schemas/courseVideoSchema'
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


        const course = await db.course.create({
            data: {
                ...data,
                userId: req.loggedUser?.id,
                courseSections: {
                    create: data.courseSections.map((section: any) => ({
                        title: section.title,
                        courseVideos: {
                            create: section.courseVideos.map((video: z.infer<typeof courseVideoSchema>) => ({
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                            })),
                        },
                    })),
                },
            },
            include: {
                courseSections: {
                    include: {
                        courseVideos: true,
                    },
                },
            },
        });

        successReturn(res, "POST", course)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const editCourse = async (req: Request, res: Response) => {
    try {
        const { data, error } = courseSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)
        const id = req.params.id
        const { name, thumbnail, description, level, tags, price, expectationPrice, benefits, prerequisites } = data


        if (!req.loggedUser || !id) throw new Error(' unauthorized access!')
        await getCourseById(id)


        data.courseSections.map(async section => {
            if (section.id) {
                await db.courseVideoSection.update({
                    where: { id: section.id },
                    data: {
                        title: section.title,
                    }
                })

                section.courseVideos.map(async video => {
                    if (video.id) {

                        await db.courseVideo.update({
                            where: { id: video.id },
                            data: {
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                            }
                        })
                    } else {

                        await db.courseVideo.create({
                            data: {
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                                courseVideoSectionId: section.id
                            }
                        })
                    }
                })
            }

            if (!section.id) {
                await db.courseVideoSection.create({
                    data: {
                        title: section.title,
                        courseId: id,
                        courseVideos: {
                            create: section.courseVideos.map((video: any) => ({
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                            })),
                        }
                    }
                })
            }
        })

        const updateCourse = await db.course.update({
            where: { id },  // Course id from the request
            data: {
                name,
                thumbnail,
                description,
                level,
                tags,
                price,
                expectationPrice,
                benefits,
                prerequisites
            }

        });

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

        if (!courseId) throw new Error('course id not provided!')

        if (findRedisCourse) {
            console.log('redis course')
            return successReturn(res, "GET", JSON.parse(findRedisCourse))
        }

        const course = await db.course.findFirstOrThrow({
            where: { id: courseId },
            select: { ...selectValue },
        })

        if (!course) {
            throw new Error("Course not found!")
        }
        // todo : extend this for ratings. -> source - prisma with ts project. 2 

        await redis.setex(String(courseId), 60 * 60, JSON.stringify(course)) // for 1 hours

        successReturn(res, "GET", course)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const deleteSingleCourse = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        await db.course.delete({ where: { id } })
        successReturn(res, "DELETE", { delete: true })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const deleteManyCourse = async (req: Request, res: Response) => {
    try {

        const deleteCourseIdAry = req.body

        await db.course.deleteMany({ where: { id: { in: deleteCourseIdAry } } })
        successReturn(res, "DELETE", { delete: true })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const allCourses = async (req: Request, res: Response) => {
    try {

        // todo: get courses only form redis. when add, update , delete do with redis in this fetch.
        const search = req.query.search as string; // Get 'name' from query parameters
        const x = search.toLowerCase()
        const findRedisAllCourses = await redis.get('courses')
        if (findRedisAllCourses) {
            console.log('redis courses')
            const filteredCourse = (JSON.parse(findRedisAllCourses) as { name: string }[]).filter(c => c.name.toLowerCase().includes(x))
            return successReturn(res, "GET", filteredCourse)
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

        await redis.setex('courses', 60, JSON.stringify(courses))

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
                                courseSections: {
                                    select: {
                                        courseVideos: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })

        const isCoursePurchased = purchasedCourses.find(course => course.id === courseId)
        if (!isCoursePurchased?.course) throw new Error('you have not access at this course!')

        successReturn(res, "GET", isCoursePurchased.course.courseSections)

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

