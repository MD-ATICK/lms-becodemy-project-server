import { User } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { verify, VerifyErrors } from "jsonwebtoken"
import { errorReturn } from "../utils/response"
import { checkCookieToken } from "../utils/token"



export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkCookieToken(req)

        if (!process.env.TOKEN_SECRET) {
            throw new Error('please login before logout!')
        }

        await verify(token, process.env.TOKEN_SECRET, async (err: VerifyErrors | null, verifyJwt: User | any) => {

            if (err) {
                throw new Error(err.message)
            }

            const user = verifyJwt as User
            if (!user) {
                throw new Error('Invalid token!')
            }

            req.loggedUser = user;
            next()
        })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}