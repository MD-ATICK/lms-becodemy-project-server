import { Request, Response } from "express";
import { errorReturn, successReturn } from "../../utils/response";
import { deleteCourseById, deleteUserById, getAllCourses, getAllOrders, getAllUsers, updateUserRole } from "../../utils/admin";
import { roleEnum } from "@prisma/client";
import { last12MonthsData } from "../../utils/analytics";
import { db } from "../../utils/db";


export const listUsers = async (req: Request, res: Response) => {
    try {

        const users = await getAllUsers()
        successReturn(res, "GET", users)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const listCourses = async (req: Request, res: Response) => {
    try {

        const courses = await getAllCourses()
        successReturn(res, "GET", courses)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


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

export const getLast12MonthDataOfUser = async (req: Request, res: Response) => {
    try {
        const data = await last12MonthsData(db.user)
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export const getLast12MonthDataOfOrder = async (req: Request, res: Response) => {
    try {
        const data = await last12MonthsData(db.order)
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export const getLast12MonthDataOfCourse = async (req: Request, res: Response) => {
    try {
        const data = await last12MonthsData(db.course)
        successReturn(res, "GET", data)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

