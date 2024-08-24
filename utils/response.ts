import { Response } from "express"


export const successReturn = (res: Response, status: "GET" | "POST" | "UPDATE" | "DELETE" | "EXPIRED", body: object) => {
    const code = {
        "GET": 200,
        "POST": 201,
        "UPDATE": 202,
        "DELETE": 203,
        "EXPIRED": 223,
    }
    return res.status(code[status]).json(body)
}

export const errorReturn = (res: Response, error: string) => {
    return res.status(400).json({ error })
}
