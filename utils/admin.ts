import { Request, Response } from "express"
import { errorReturn } from "./response"
import { db } from "./db"
import { roleEnum } from "@prisma/client"
import { redis } from "../app"
import dotenv from 'dotenv'
import { getUserById } from "./user"
import { getCourseById } from "./course"
dotenv.config()

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return users;
    } catch (error) {
        throw error;
    }
}
export const getAllOrders = async () => {
    try {
        const orders = await db.order.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return orders;
    } catch (error) {
        throw error;
    }
}
export const getAllCourses = async () => {
    try {
        const courses = await db.course.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return courses;
    } catch (error) {
        throw error;
    }
}
export const updateUserRole = async (userId: string, role: roleEnum) => {
    try {
        const courses = await db.user.update({ where: { id: userId }, data: { role } })

        return courses;
    } catch (error) {
        throw error;
    }
}

export const deleteUserById = async (id: string) => {
    try {

        await getUserById(id)

        await db.user.delete({ where: { id } })

        return;
    } catch (error) {
        throw error;
    }
}

export const deleteCourseById = async (id: string) => {
    try {

        await getCourseById(id)

        await db.course.delete({ where: { id } })
        await redis.del(id)

        const courses = await db.course.findMany()
        await redis.setex('allCourses', process.env.REDIS_COURSE_TIME || 0, JSON.stringify(courses))

        return;
    } catch (error) {
        throw error;
    }
}

