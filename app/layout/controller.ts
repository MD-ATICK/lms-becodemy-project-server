import { Request, Response } from "express"
import { redis } from ".."
import { bannerSchema, categorySchema, faqSchema, layoutSchema } from "../../schemas/layoutSchema"
import { db } from "../../utils/db"
import { errorReturn, successReturn } from "../../utils/response"
import { zodErrorToString } from "../../utils/zodErrorToString"



export const setActiveLayout = async (req: Request, res: Response) => {
    try {
        const layoutId = req.params.id
        await db.layout.updateMany({ data: { isActive: false } })

        const updatedLayout = await db.layout.update({ where: { id: layoutId }, data: { isActive: true }, include: { faqs: true, categories: true } })

        if (!updatedLayout) throw new Error('layout not updated!')
        await redis.set("activeLayout", JSON.stringify(updatedLayout))

        const layouts = await db.layout.findMany({})

        successReturn(res, "UPDATE", layouts)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getActiveLayoutForClient = async (req: Request, res: Response) => {
    try {

        const redisLayout = await redis.get('activeLayout')

        if (redisLayout) {
            return successReturn(res, "GET", JSON.parse(redisLayout))
        }

        const layout = await db.layout.findFirstOrThrow({
            where: { isActive: true },
            include: { faqs: true, categories: true }
        })

        await redis.set('activeLayout', JSON.stringify(layout))
        successReturn(res, "GET", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const getSingleLayout = async (req: Request, res: Response) => {
    try {

        const layoutId = req.params.id;

        const redisLayout = await redis.get(layoutId)
        if (redisLayout) return successReturn(res, "GET", JSON.parse(redisLayout))

        const layout = await getLayoutById(layoutId)

        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
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

export const deleteLayoutsByNameAry = async (req: Request, res: Response) => {
    try {

        const layoutNameAry: string[] = req.body;

        const find = await db.layout.findFirst({ where: { layoutName: { in: layoutNameAry }, isActive: true } })
        if (find) {
            throw new Error('you cannot remove active layout! switching it!')
        }

        await db.layout.deleteMany({
            where: {
                layoutName: {
                    in: layoutNameAry
                }
            }
        })

        return successReturn(res, "DELETE", { message: 'delete successfully' })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const createLayout = async (req: Request, res: Response) => {
    try {
        const { error, data } = layoutSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        await db.layout.updateMany({ data: { isActive: false } })

        const { layoutName } = data;

        // if (layoutName) {
        //     throw new Error('just fun error!')
        // }

        const findLayout = await db.layout.findFirst({ where: { layoutName } })
        if (findLayout) {
            throw new Error('this layout already exist!')
        }

        const layout = await db.layout.create({
            data: {
                layoutName,
                isActive: true,
                // faqs: {
                //     create: faq
                // },
                // categories: {
                //     create: category
                // },
                // banners: {
                //     create: banner
                // }
            },
            // include: {
            //     faqs: true,
            //     categories: true,
            //     banners: true
            // }
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

        if (layout.isActive) {
            await redis.set('activeLayout', JSON.stringify(layout))
        }
        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "POST", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const EditFaq = async (req: Request, res: Response) => {
    try {

        const { error, data } = faqSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { answer, question, id, layoutId } = data
        if (!id) throw new Error('invalid faq id!')

        await db.faq.update({
            where: { id },
            data: {
                answer,
                question,
                layoutId
            }
        })

        const layout = await getLayoutById(layoutId)

        if (layout.isActive) {
            await redis.set('activeLayout', JSON.stringify(layout))
        }
        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "UPDATE", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const EditCategory = async (req: Request, res: Response) => {
    try {

        const { error, data } = categorySchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { title, image, id, layoutId } = data
        if (!id) throw new Error('invalid category id!')

        await db.category.update({
            where: { id },
            data: {
                title,
                image,
                layoutId
            }
        })

        const layout = await getLayoutById(layoutId)

        if (layout.isActive) {
            await redis.set('activeLayout', JSON.stringify(layout))
        }
        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "UPDATE", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const deleteFaq = async (req: Request, res: Response) => {
    try {
        const { id, layoutId } = req.body;
        if (!id) throw new Error('id required')

        await db.faq.delete({ where: { id } })

        const layout = await getLayoutById(layoutId)

        if (layout.isActive) {
            await redis.set('activeLayout', JSON.stringify(layout))
        }
        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "DELETE", { message: 'delete faq successfully!' })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const addBanner = async (req: Request, res: Response) => {
    try {

        const { error, data } = bannerSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { title, subTitle, image, layoutId } = data

        await db.layout.update({
            where: { id: layoutId },
            data: {
                banner: {
                    title,
                    subTitle,
                    image
                }
            },
            include: {
                faqs: true,
                categories: true
            }
        })

        const layout = await getLayoutById(layoutId)
        if (layout.isActive) {
            await redis.set('activeLayout', JSON.stringify(layout))
        }
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

        if (layout.isActive) {
            await redis.set('activeLayout', JSON.stringify(layout))
        }
        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))
        successReturn(res, "POST", layout)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { deleteCateAry, layoutId }: { deleteCateAry: string[], layoutId: string } = req.body;

        await db.category.deleteMany({ where: { id: { in: deleteCateAry } } })

        const layout = await getLayoutById(layoutId)

        await redis.setex(layout.id, 60 * 60, JSON.stringify(layout))

        successReturn(res, "DELETE", { message: 'delete category successfully!' })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}



// -----------------  just reuse find ----------------------------
// -----------------  just reuse find ----------------------------

const getLayoutById = async (id: string) => {
    try {
        const layout = await db.layout.findFirst({ where: { id }, include: { faqs: true, categories: true } })

        if (!layout) {
            throw new Error('layout not found')
        }

        return layout;

    } catch (error) {
        throw error;
    }
}