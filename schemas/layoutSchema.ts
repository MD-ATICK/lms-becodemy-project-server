import * as z from 'zod'

// default single banner , single faq , single category!

export const layoutSchema = z.object({
    layoutName: z.string().nonempty('layoutName is required'),
    // banner: z.object({
    //     title: z.string().nonempty('banner.title is required'),
    //     subTitle: z.string().nonempty('banner.sub title is required'),
    //     image: z.object({
    //         public_id: z.string().nonempty('banner.image.public_id is required'),
    //         url: z.string().nonempty('banner.image url is required'),
    //     })
    // }),
    // faq: z.object({
    //     question: z.string().nonempty('faq.question is required'),
    //     answer: z.string().nonempty('faq.answer is required'),
    // }),
    // category: z.object({
    //     title: z.string().nonempty('category.title is required'),
    //     image: z.object({
    //         public_id: z.string().nonempty('category.image.public_id is required'),
    //         url: z.string().nonempty('category.image.url is required'),
    //     })
    // }),
})

export const bannerSchema = z.object({
    layoutId: z.string().nonempty('faq.question is required'),

    title: z.string().nonempty('banner.title is required'),
    subTitle: z.string().nonempty('banner.sub title is required'),
    image: z.object({
        public_id: z.string().nonempty('banner.image.public_id is required'),
        url: z.string().nonempty('banner.image url is required'),
    })
})

export const faqSchema = z.object({
    layoutId: z.string().nonempty('faq.question is required'),
    question: z.string().nonempty('faq.question is required'),
    answer: z.string().nonempty('faq.answer is required'),
    id: z.optional(z.string())
})

export const categorySchema = z.object({
    layoutId: z.string().nonempty('faq.question is required'),
    title: z.string().nonempty('category.title is required'),
    image: z.object({
        public_id: z.string().nonempty('category.image.public_id is required'),
        url: z.string().nonempty('category.image.url is required'),
    }),
    id: z.optional(z.string())

})