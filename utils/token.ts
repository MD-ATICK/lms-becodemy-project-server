import { User } from "@prisma/client";
import dotenv from 'dotenv';
import { Request } from "express";
import { sign } from "jsonwebtoken";
import * as z from "zod";
import { registerSchema } from "../schemas/userSchema";

dotenv.config()
export const createRegisterMailToken = async (user: z.infer<typeof registerSchema>) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()

    if (!process.env.REGISTER_MAIL_TOKEN_SECRET) {
        throw new Error('token secret is required!')
    }
    const activationToken = await sign({ user, activationCode }, process.env.REGISTER_MAIL_TOKEN_SECRET, { expiresIn: "15m" })

    return { activationToken, activationCode }
}

export const createToken = async (user: User) => {

    if (!process.env.TOKEN_SECRET) {
        throw new Error('token secret is required!')
    }

    const token = await sign(user, process.env.TOKEN_SECRET, { expiresIn: "7d" })

    return token;
}


export const checkCookieToken = (req: Request) => {
    const token = req.cookies.token
    if (!token) {
        throw new Error('unauthorized access for token!')
    }

    return token
}