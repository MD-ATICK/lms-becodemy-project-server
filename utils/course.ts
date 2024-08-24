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
        reviews: true,
        coursesVideos: {
            select: {
                id: true,
                title: true,
                questions: {
                    select: {
                        id: true,
                        question: true,
                        questionAnswers: {
                            select: {
                                id: true,
                                answer: true,
                                user: true,
                                createdAt: true
                            }
                        },
                        user: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                videoSection: true,
                description: true,
                videoLength: true,
                createdAt: true,
                updatedAt: true,
            }
        },
        createdAt: true,
        updatedAt: true,

    }
}