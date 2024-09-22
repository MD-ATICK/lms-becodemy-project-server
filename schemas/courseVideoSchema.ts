import * as z from 'zod'

export const courseVideoSchema = z.object({
    id: z.optional(z.string()),
    videoUrl: z.string().nonempty('videoUrl is required'),
    title: z.string().nonempty('title is required'),
    // videoSection: z.string().nonempty('videoSection is required'),
    description: z.string().nonempty('description is required'),
    videoLength: z.string().nonempty('videoLength is required'),
    videoPlayer: z.string().nonempty('videoPlayer is required'),
    suggestion: z.string().nonempty('suggestion is required'),
    courseId: z.string().nonempty('courseId is required'),
})
export const queryOFcourseSchema = z.object({
    name: z.string().nonempty('name is required'),
    // category: z.string().nonempty('category is required'),
})


