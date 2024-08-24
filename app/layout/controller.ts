import { Request, Response } from "express"
import { errorReturn, successReturn } from "../../utils/response"
import { db } from "../../utils/db"
import { bannerSchema, categorySchema, faqSchema, layoutSchema } from "../../schemas/layoutSchema"
import { zodErrorToString } from "../../utils/zodErrorToString"
import { redis } from ".."



export const setActiveLayout = async (req: Request, res: Response) => {
    try {
        const layoutId = req.params.id
        await db.layout.updateMany({ data: { isActive: false } })

        const updatedLayout = await db.layout.update({ where: { id: layoutId }, data: { isActive: true }, include: { faqs: true, banners: true, categories: true } })

        if (!updatedLayout) throw new Error('layout not updated!')
        await redis.set("activeLayout", JSON.stringify(updatedLayout))

        successReturn(res, "UPDATE", updatedLayout)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getActiveLayoutForClient = async (req: Request, res: Response) => {
    try {

        const layout = await redis.get('activeLayout')

        if (!layout) throw new Error('Active layout not found')
        // const layout = await db.layout.findFirstOrThrow({
        //     where: { isActive: true },
        //     include: { banners: true, faqs: true, categories: true }
        // })

        successReturn(res, "GET", JSON.parse(layout))

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getSingleLayout = async (req: Request, res: Response) => {
    try {

        const layoutId = req.params.id;

        // const redisLayout = await redis.get(layoutId)
        // if (redisLayout) return successReturn(res, "GET", JSON.parse(redisLayout))

        const layout = await getLayoutById(layoutId)

        // await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "GET", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getAllLayout = async (req: Request, res: Response) => {
    try {

        const layouts = await db.layout.findMany({})

        successReturn(res, "GET", layouts)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const createLayout = async (req: Request, res: Response) => {
    try {
        const { error, data } = layoutSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        await db.layout.updateMany({ data: { isActive: false } })

        const { layoutName, faq, category, banner } = data;

        const layout = await db.layout.create({
            data: {
                layoutName,
                isActive: true,
                faqs: {
                    create: faq
                },
                categories: {
                    create: category
                },
                banners: {
                    create: banner
                }
            },
            include: {
                faqs: true,
                categories: true,
                banners: true
            }
        })

        await redis.set('activeLayout', JSON.stringify(layout))

        successReturn(res, "POST", layout)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const addFaq = async (req: Request, res: Response) => {
    try {

        const { error, data } = faqSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { answer, question, layoutId } = data

        await db.faq.create({
            data: {
                answer,
                question,
                layoutId
            }
        })

        const layout = await getLayoutById(layoutId)

        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))

        successReturn(res, "POST", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const addBanner = async (req: Request, res: Response) => {
    try {

        const { error, data } = bannerSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { title, subTitle, image, layoutId } = data

        await db.banner.create({
            data: {
                layoutId,
                title,
                subTitle,
                image,
            }
        })

        const layout = await getLayoutById(layoutId)

        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "POST", layout)


    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const addCategory = async (req: Request, res: Response) => {
    try {

        const { error, data } = categorySchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { image, title, layoutId } = data

        await db.category.create({
            data: {
                layoutId,
                title,
                image,
            }
        })

        const layout = await getLayoutById(layoutId)

        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "POST", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}



// -----------------  just reuse find ----------------------------
// -----------------  just reuse find ----------------------------

const getLayoutById = async (id: string) => {
    try {
        const layout = await db.layout.findFirst({ where: { id }, include: { faqs: true, banners: true, categories: true } })

        if (!layout) {
            throw new Error('layout not found')
        }

        return layout;

    } catch (error) {
        throw error;
    }
}