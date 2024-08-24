import * as z from 'zod'


export const orderSchema = z.object({
    courseId: z.string().nonempty('userId is required'),
})