import z from "zod";


export const passwordSchemas = {
    // Simple password (for login)
    simple: z.string().min(1, "Password is required"),

    // Strong password (for signup/reset)
    strong: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number"),

    // Password fields for spreading into objects
    fields: {
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters long")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/\d/, "Password must contain at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    },

    // Password with confirmation
    withConfirmation: (passwordField: string = "password") => z.object({
        [passwordField]: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters long")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/\d/, "Password must contain at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    }).refine((data) => data[passwordField] === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
};

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: passwordSchemas.simple,
})

export const signupSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    ...passwordSchemas.fields,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});