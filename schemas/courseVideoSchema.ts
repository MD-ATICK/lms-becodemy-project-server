import * as z from 'zod'

export const courseVideoSchema = z.object({
    videoUrl: z.string().nonempty('videoUrl is required'),
    title: z.string().nonempty('title is required'),
    videoSection: z.string().nonempty('videoSection is required'),
    description: z.string().nonempty('description is required'),
    videoLength: z.number(),
    videoPlayer: z.string().nonempty('videoPlayer is required'),
    suggestion: z.string().nonempty('suggestion is required'),
    courseId: z.string().nonempty('courseId is required'),
})
