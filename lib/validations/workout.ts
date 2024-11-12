import * as z from "zod";

export const WorkoutValidation = z.object({
    title: z.string().min(1, "Required"),
    description: z.string().optional(),
    exerciseTarget: z.string().min(1, "Required"),
    age: z.string().refine((value) => !isNaN(Number(value)), "Age must be a number"),
    weight: z.string().refine((value) => !isNaN(Number(value)), "Weight must be a number"),
    height: z.string().refine((value) => !isNaN(Number(value)), "Height must be a number"),
    gender: z.enum(["male", "female", "other"]),
    goal: z.enum(["weight_loss", "muscle_gain", "maintenance"]),
});

export type WorkoutFormValues = z.infer<typeof WorkoutValidation>;
