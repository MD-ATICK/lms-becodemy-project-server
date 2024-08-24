import { hashSync } from 'bcryptjs';
import * as z from "zod";
import { registerSchema } from "../schemas/userSchema";
import { db } from "./db";

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findFirst({ where: { id } })

        if (!user) {
            throw new Error('User not found')
        }

        return user;

    } catch (error) {
        throw error;
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findFirst({ where: { email }, include: { purchasedCourses: true } })

        if (!user) {
            throw new Error('User not found')
        }

        return user;

    } catch (error) {
        throw error;
    }
}

export const checkUserExistence = async (email: string) => {
    try {
        const user = await db.user.findFirst({ where: { email } })

        if (user) {
            throw new Error('user already exist')
        }

        return user;

    } catch (error) {
        throw error;
    }
}

export const createUser = async ({ name, email, password, avatar }: z.infer<typeof registerSchema>) => {
    try {

        if(!password) throw new Error('password!')

        const hashedPassword = hashSync(password, 10)
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        return newUser;
    } catch (error) {
        throw error;
    }
}


// testing purpose

export const test = async (id: string) => {
    try {

    } catch (error) {
        throw error;
    }
}

