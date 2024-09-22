import * as z from 'zod'

const courseVideoSchema = z.array(z.object({
    id: z.string().optional(),  // Make id optional
    videoUrl: z.string().nonempty('videoUrl is required'),
    title: z.string().nonempty('title is required'),
    // videoSection: z.string().nonempty('videoSection is required'),
    description: z.string().nonempty('description is required'),
    videoLength: z.string().nonempty('videoLength is required'),
    videoPlayer: z.string().nonempty('videoPlayer is required'),
    suggestion: z.string().nonempty('suggestion is required'),
})).min(1, { message: "at least one video is required" })


export const courseSchema = z.object({
    id: z.string().optional(),  // Make id optional
    name: z.string().nonempty('name is required'),
    description: z.string().nonempty('name is required'),
    price: z.number(),
    expectationPrice: z.number(),
    thumbnail: z.object({ public_id: z.string(), url: z.string() }),
    tags: z.array(z.string()).min(1, { message: 'at least one tag is required' }),
    level: z.string().nonempty('level is required'),
    demoUrl: z.string().nonempty('demoUrl is required'),
    benefits: z.array(z.object({ title: z.string() })).nonempty('benefits is required'),
    prerequisites: z.array(z.object({ title: z.string() })).nonempty('prerequisites is required'),
    courseSections: z.array(z.object({ id: z.optional(z.string()), title: z.string(), courseVideos: courseVideoSchema })).min(1, { message: 'at least one course section is required' })
})


export const uploadImageSchema = z.object({
    folder: z.string().nonempty('folders is required'),
    image: z.string().nonempty('thumbnail is required'),
    destroy_public_id: z.optional(z.string()),
})