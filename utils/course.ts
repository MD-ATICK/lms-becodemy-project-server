import { db } from "./db";

export const getCourseById = async (id: string) => {
    try {
        const course = await db.course.findFirst({ where: { id } })

        if (!course) {
            throw new Error('course not found')
        }

        return course;

    } catch (error) {
        throw new Error("Failed to get course!");
    }
}


export const selectData = () => {
    return {
        id: true,
        name: true,
        description: true,
        price: true,
        expectationPrice: true,
        thumbnail: true,
        tags: true,
        level: true,
        demoUrl: true,
        purchased: true,
        benefits: true,
        prerequisites: true,
        order: true,
        reviews: true,
        courseSections: {
            select: {
                id: true,
                title: true,
                courseVideos: {
                    select: {
                        id: true,
                        title: true,
                        links: true,
                        // questions: {
                        //     select: {
                        //         id: true,
                        //         question: true,
                        //         questionAnswers: {
                        //             select: {
                        //                 id: true,
                        //                 answer: true,
                        //                 user: true,
                        //                 createdAt: true
                        //             }
                        //         },
                        //         user: true,
                        //         createdAt: true,
                        //         updatedAt: true,
                        //     },
                        // },
                        description: true,
                        videoLength: true,
                        videoPlayer: true,
                        suggestion: true,
                        videoUrl: true,
                        createdAt: true,
                    }
                }
            }
        },
        createdAt: true,
        updatedAt: true
    }
}