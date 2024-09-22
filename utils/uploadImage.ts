import cloudinary from 'cloudinary'
import { Request, Response } from "express"
import { uploadImageSchema } from "../schemas/courseSchema"
import { errorReturn, successReturn } from './response'
import { zodErrorToString } from "./zodErrorToString"

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const { data, error } = uploadImageSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        if (data.destroy_public_id) {
            await cloudinary.v2.uploader.destroy(data.destroy_public_id)
        }
        const myCloud = await cloudinary.v2.uploader.upload(data.image, { folder: data.folder, width: 800 })

        successReturn(res, "POST", { public_id: myCloud.public_id, url: myCloud.secure_url })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const rootGet = (req: Request, res:Response) => {
    try {
        successReturn(res, "GET" , { message : 'please save red blood! 17 july'})
    } catch (error) {
        errorReturn(res , (error as Error).message)
    }
}