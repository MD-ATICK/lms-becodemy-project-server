import z from 'zod'


export const registerSchema = z.object({
    name: z.string().nonempty("name is required"),
    email: z.string().email().nonempty("email is required"),
    password: z.optional(z.string().min(6, { message: "password must be 6 letter." })),
    avatar: z.optional(z.object({ public_id: z.string(), url: z.string() })),
})


export const loginSchema = z.object({
    email: z.string().email().nonempty("email is required"),
    password: z.string().nonempty("password is required"),
})

export const updatePasswordSchema = z.object({
    oldPassword: z.string().nonempty("old password is required"),
    newPassword: z.string().nonempty("new password is required"),
})


export const activateUserSchema = z.object({
    activate_token: z.string().nonempty("token is required"),
    activate_code: z.string().nonempty("code is required"),
})
