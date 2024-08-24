import { roleEnum } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { errorReturn } from "../utils/response"




export const rolesAuth = (...roles: roleEnum[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.loggedUser && !roles.includes(req.loggedUser?.role)) {
            return errorReturn(res, "You are not allowed to access this!")
        }

        next()
    }
}