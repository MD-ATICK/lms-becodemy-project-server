import * as z from 'zod'

const courseVideoSchema = z.array(z.object({
    videoUrl: z.string().nonempty('videoUrl is required'),
    title: z.string().nonempty('title is required'),
    videoSection: z.string().nonempty('videoSection is required'),
    description: z.string().nonempty('description is required'),
    videoLength: z.number(),
    videoPlayer: z.string().nonempty('videoPlayer is required'),
    suggestion: z.string().nonempty('suggestion is required'),
}))


export const courseSchema = z.object({
    name: z.string().nonempty('name is required'),
    description: z.string().nonempty('name is required'),
    price: z.number(),
    expectationPrice: z.number(),
    thumbnail: z.object({ public_id: z.string(), url: z.string() }),
    tags: z.string().nonempty('tags is required'),
    level: z.string().nonempty('level is required'),
    demoUrl: z.string().nonempty('demoUrl is required'),
    benefits: z.array(z.object({ title: z.string() })).nonempty('benefits is required'),
    prerequisites: z.array(z.object({ title: z.string() })).nonempty('prerequisites is required'),
    courseVideos: courseVideoSchema
})


export const uploadImageSchema = z.object({
    folder: z.string().nonempty('folders is required'),
    image: z.string().nonempty('thumbnail is required'),
    destroy_public_id: z.optional(z.string()),
})