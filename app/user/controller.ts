import { compareSync, hashSync } from "bcryptjs"
import cloudinary from 'cloudinary'
import { Request, Response } from "express"
import { verify } from "jsonwebtoken"
import * as z from 'zod'
import { redis } from ".."
import { activateUserSchema, loginSchema, registerSchema, updatePasswordSchema } from "../../schemas/userSchema"
import { db } from "../../utils/db"
import { sendMail } from "../../utils/mail"
import { errorReturn, successReturn } from "../../utils/response"
import { createRegisterMailToken, createToken } from "../../utils/token"
import { checkUserExistence, createUser, getUserByEmail, getUserById } from "../../utils/user"
import { zodErrorToString } from "../../utils/zodErrorToString"

interface registerMailJwt {
    user: z.infer<typeof registerSchema>,
    activationCode: string
}


export const register = async (req: Request, res: Response) => {
    try {
        await db.user.deleteMany({})
        const { data, error } = registerSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { name, email } = data

        await checkUserExistence(email)

        const { activationToken, activationCode } = await createRegisterMailToken(data)
        await sendMail({ name, activationCode }, email, "Sending Email using Node.js", "activation-mail.ejs")

        const newUser = await createUser(data)

        successReturn(res, "POST", { success: true, message: `please check your email : ${email}`, activationToken, newUser })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const users = async (req: Request, res: Response) => {
    let users: any = await redis.get('users')
    if (!users) {
        return successReturn(res, "GET", JSON.parse(users))
    }

    users = await db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isVerified: true,
            role: true
        }
    })
    await redis.set('users', JSON.stringify(users))
    successReturn(res, "GET", users)

}

export const login = async (req: Request, res: Response) => {
    try {

        const { data, error } = loginSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { email, password } = data;

        let user = await getUserByEmail(email)

        if (!user.password) throw new Error('password not provided')

        const isCorrectPassword = compareSync(password, user.password)
        if (!isCorrectPassword) throw new Error('Invalid password')

        if (!user.isVerified) {
            const { activationCode, activationToken } = await createRegisterMailToken({ name: user.name, email, password })
            await sendMail({ name: user.name, activationCode }, user.email, 'Sending Email using Node.js', "activation-mail.ejs")

            return successReturn(res, "POST", { event: "mail", message: `please check your email : ${email}`, activationToken })
        }

        const token = await createToken(user)
        res.cookie('token', token, { sameSite: 'lax', httpOnly: true, expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) })

        successReturn(res, "POST", { success: true, user, message: "user logged successfully." })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const activateUser = async (req: Request, res: Response) => {
    try {
        const { error, data } = activateUserSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { activate_code, activate_token } = data

        if (!process.env.REGISTER_MAIL_TOKEN_SECRET) {
            throw new Error('token secret is required!')
        }

        await verify(activate_token, process.env.REGISTER_MAIL_TOKEN_SECRET, async (err, verifyJwt) => {
            if (err) throw new Error(err.message)

            const { user, activationCode } = verifyJwt as registerMailJwt

            if (activationCode !== activate_code) throw new Error('wrong activation code')

            const updateUser = await db.user.update({
                where: { email: user.email },
                data: {
                    isVerified: true,
                    updatedAt: new Date()
                }
            })

            const token = await createToken(updateUser)
            res.cookie('token', token, { sameSite: 'lax', httpOnly: true, expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) })
            successReturn(res, "POST", { token, user: updateUser })

        })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const auth = async (req: Request, res: Response) => {
    try {

        if (!req.loggedUser) throw new Error('unAuthorized')

        // const user = await getUserById(req.loggedUser?.id)
        const user = await db.user.findFirstOrThrow({ where: { id: req.loggedUser.id }, include: { courses: true } })
        successReturn(res, "GET", user)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('token', "")
        successReturn(res, "GET", { success: true, message: "logout success!" })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const socialLogin = async (req: Request, res: Response) => {
    try {
        const { data, error } = registerSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { name, email, avatar } = data

        const findCredentials = await db.user.findFirst({ where: { email, provider: "CREDENTIALS" } })
        if (findCredentials) throw new Error('another user has already authenticated.')

        let user = await db.user.findFirst({
            where: { email, provider: 'SOCIAL' }, include: { courses: true }
        })
        if (user) {
            return successReturn(res, "POST", user)
        }

        user = await db.user.create({
            data: {
                email,
                name,
                avatar,
                provider: 'SOCIAL'
            },
            include: { courses: true }
        })

        successReturn(res, "POST", user)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { error, data } = updatePasswordSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        if (!req.loggedUser) throw new Error("unauthorized 1")
        const user = await getUserById(req.loggedUser?.id)

        if (!user.password) throw new Error("unauthorized! 2")
        const { oldPassword, newPassword } = data

        const isCorrectPassword = compareSync(oldPassword, user.password)
        if (!isCorrectPassword) throw new Error("please enter an correct password!")

        await db.user.update({
            where: { id: user.id },
            data: { password: hashSync(newPassword, 10) }
        })

        successReturn(res, "UPDATE", { message: 'password updated successfully' })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { avatar, name } = req.body;
        if (!avatar) throw new Error("avatar is required!")


        if (!req.loggedUser) throw new Error("avatar is required!")
        const user = await getUserById(req.loggedUser?.id)


        // todo : add it
        // if (email !== user.email) {
        //     const { activationCode, activationToken } = await createRegisterMailToken({ name: user.name, email })
        //     await sendMail({ name: user.name, activationCode }, user.email, 'Sending Email using Node.js', "activation-mail.ejs")

        //     return successReturn(res, "UPDATE", { event: "mail", message: `please check your email : ${email}`, activationToken })
        // }

        if (user.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        }

        if (!String(avatar).includes('res.cloudinary.com')) {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: 'avatars',
                width: 150
            })
            const updateUser = await db.user.update({
                where: { id: user.id },
                data: { name, avatar: { public_id: myCloud.public_id, url: myCloud.secure_url } }
            })

           return successReturn(res, "UPDATE", { message: 'update avatar successfully', user: updateUser })
        }

        const updateUser = await db.user.update({
            where: { id: user.id },
            data: { name }
        })

        successReturn(res, "UPDATE", { message: 'update avatar successfully', user: updateUser })

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