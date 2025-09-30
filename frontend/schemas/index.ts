import * as z from "zod";


export const LoginSchema = z.object({
    email: z.email({
        message: "Email is required!"
    }),
    password: z.string().min(1, {
        message: "Password is required!"
    })
})

export const RegisterSchema = z.object({
    firstName: z.string().min(1, {
        message: "Please enter valid email first name!"
    }),
    lastName: z.string().min(1, {
        message: "Please enter valid email last name!"
    }),
    email: z.email({
        message: "Please enter valid email"
    }),
    password: z.string().min(8, {
        message: "Password should be minimum 8 characters!"
    })
})

export const UserProfileSchema = z.object({
    userName: z.string(),
    firstName: z.string().min(1, {
        message: "Please enter valid email first name!"
    }),
    lastName: z.string().min(1, {
        message: "Please enter valid email last name!"
    }),
    email: z.email({
        message: "Please enter valid email"
    })
})