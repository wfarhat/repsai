import * as z from "zod";

export const WorkoutEditValidation = z.object({
    title: z.string().min(1, "Title is required"),
    exercises: z.array(
        z.object({
            name: z.string().min(1, "Exercise name is required"),
            sets: z.number().min(1, "Sets must be at least 1"),
            reps: z.number().min(1, "Reps must be at least 1"),
        })
    ),
});

export type WorkoutEditFormValues = z.infer<typeof WorkoutEditValidation>;
