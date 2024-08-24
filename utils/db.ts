import { PrismaClient } from "@prisma/client"
import dotenv from 'dotenv'

dotenv.config()
declare global {
    var prisma: PrismaClient | undefined
}


export const db = globalThis.prisma || new PrismaClient();

if (process.env.APP !== 'production') globalThis.prisma = db;