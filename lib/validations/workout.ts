import * as z from "zod";

export const WorkoutValidation = z.object({
    title: z.string().min(1, "Required"),
    description: z.string().optional(),
    exerciseTarget: z.string().min(1, "Required"),
    age: z
      .string()
      .refine((value) => !isNaN(Number(value)), "Age must be a number")
      .transform((value) => Number(value))
      .refine((value) => value >= 15 && value <= 100, "Age must be between 15 and 100"),
    weight: z
      .string()
      .refine((value) => !isNaN(Number(value)), "Weight must be a number")
      .transform((value) => Number(value))
      .refine((value) => value >= 30 && value <= 300, "Weight must be between 30 and 300 kg"),
    height: z
      .string()
      .refine((value) => !isNaN(Number(value)), "Height must be a number")
      .transform((value) => Number(value))
      .refine((value) => value >= 100 && value <= 250, "Height must be between 100 and 250 cm"),
    gender: z.enum(["male", "female", "other"]),
    goal: z.enum(["weight_loss", "muscle_gain", "maintenance"]),
});

export type WorkoutFormValues = z.infer<typeof WorkoutValidation>;
