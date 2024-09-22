import { db } from "./db";

export const getQuestionsByCourseVideoID = async (courseVideoId: string) => {
    try {

        const questions = await db.question.findMany({
            where: { courseVideoId },
            include: {
                user: true,
                questionAnswers: true
            },
            orderBy: {
                createdAt: "desc"
            },
        })


        return questions;
    } catch (error) {
        throw new Error("Failed to get course!");
    }
}
