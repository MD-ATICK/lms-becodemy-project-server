import axios from "axios";
import dotenv from 'dotenv';
import { Request, Response } from "express";
import { redis } from "..";
import { deleteCourseById, deleteUserById, getAllAdmins, getAllCourses, getAllOrders, getAllUsers, updateUserRole } from "../../utils/admin";
import { errorReturn, successReturn } from "../../utils/response";
dotenv.config()



export const makeAdmins = async (req: Request, res: Response) => {
    try {

        const emailAry: string[] = req.body
        if (!emailAry) throw new Error('invalid email array!')

        await prisma?.user.updateMany({
            where: {
                email: { in: emailAry }
            },
            data: {
                role: 'ADMIN'
            },
        })

        const admins = await prisma?.user.findMany({ where: { role: 'ADMIN' } })
        successReturn(res, "POST", { admins })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const removeAdmins = async (req: Request, res: Response) => {
    try {

        const emailAry: string[] = req.body
        if (!emailAry) throw new Error('invalid email array!')

        await prisma?.user.updateMany({
            where: {
                email: { in: emailAry }
            },
            data: {
                role: 'USER'
            },
        })

        const admins = await prisma?.user.findMany({ where: { role: "ADMIN" } })
        successReturn(res, "POST", { admins })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const vdoCipherUploadVideo = async (req: Request, res: Response) => {
    try {

        const { videoId } = req.body
        if (!videoId) throw new Error('Please provide a video id.')

        const { data } = await axios.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, { headers: { Accept: 'application/json', "Content-Type": "application/json", Authorization: `Apisecret ${process.env.VDO_CIPHER_API_SECRET}` } })

        successReturn(res, "POST", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }

}

export const listUsers = async (req: Request, res: Response) => {
    try {

        // const cachedUsers = await redis.get('users')
        // if (cachedUsers) {
        //     return successReturn(res, "GET", JSON.parse(cachedUsers))
        // }

        const users = await getAllUsers()

        // await redis.setex('users', 60, JSON.stringify(users))
        successReturn(res, "GET", users)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export const listAdmins = async (req: Request, res: Response) => {
    try {
        // const cachedUsers = await redis.get('admins')
        // if (cachedUsers) {
        //     return successReturn(res, "GET", JSON.parse(cachedUsers))
        // }

        const admins = await getAllAdmins()
        // await redis.setex('admins', 60, JSON.stringify(admins))
        successReturn(res, "GET", admins)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const listCourses = async (req: Request, res: Response) => {
    try {
        const findRedisAllCourses = await redis.get('courses')
        if (findRedisAllCourses) {
            return successReturn(res, "GET", JSON.parse(findRedisAllCourses))
        }


        const courses = await getAllCourses()
        successReturn(res, "GET", courses)
        await redis.setex('courses', process.env.REDIS_COURSE_TIME || 15, JSON.stringify(courses))


    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

// export const getSingleCourse = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         if (!id) throw new Error('id required!')

//         const course = await db.course.findFirstOrThrow({
//             where: { id }, include: {
//                 courseSections: true,
//                 reviews: true,
//             }
//         })
//         successReturn(res, "GET", course)

//     } catch (error) {
//         errorReturn(res, (error as Error).message)
//     }
// }


export const listOrders = async (req: Request, res: Response) => {
    try {

        const orders = await getAllOrders()
        successReturn(res, "GET", orders)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const updateRole = async (req: Request, res: Response) => {
    try {

        const { userId, role } = req.body

        const updatedUser = await updateUserRole(userId, role)
        successReturn(res, "UPDATE", updatedUser)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await deleteUserById(req.params.id)

        successReturn(res, "DELETE", { success: true })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const deleteCourse = async (req: Request, res: Response) => {
    try {
        await deleteCourseById(req.params.id)

        successReturn(res, "DELETE", { success: true })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
