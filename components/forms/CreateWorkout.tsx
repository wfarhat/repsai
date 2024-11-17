"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { WorkoutValidation } from "@/lib/validations/workout";
import { createWorkout } from "@/lib/actions/workout.actions";

type WorkoutFormValues = z.infer<typeof WorkoutValidation>;

interface Props {
    userId: string; 
}

// Function to handle workout creation and API integration
async function handleCreateWorkout(values: WorkoutFormValues, userId: string) {
    try {
        // Call API to generate workout
        const response = await fetch("/api/generateWorkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Failed to generate workout");

        // Parse response and extract generated exercises
        const data = await response.json();
        const exercises = data.exercises;

        // Save the generated workout in the database
        await createWorkout({
            title: values.title,
            description: values.description,
            user: userId,
            exercises,
        });

        return true;
    } catch (error) {
        console.error("Submission Error:", error);
        return false; 
    }
}

// Component to render the Create Workout form
function CreateWorkout({ userId }: Props) {
    const router = useRouter();

    // Initialize form with validation and default values
    const form = useForm<WorkoutFormValues>({
        resolver: zodResolver(WorkoutValidation),
        defaultValues: {
            title: "",
            description: "",
            gender: undefined,
            goal: undefined,
            exerciseTarget: "",
        },
    });

    // Handle form submission
    const onSubmit = async (values: WorkoutFormValues) => {
        const success = await handleCreateWorkout(values, userId);
        form.reset(); 
        router.push(`/workout`); 
    };

    return (
        <Form {...form}>
            <form className="mt-10 flex flex-col justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Input for Workout Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base-semibold text-light-2">Workout Title</FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Input {...field} placeholder="Enter workout title" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Input for Exercise/Muscle Target */}
                <FormField
                    control={form.control}
                    name="exerciseTarget"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base-semibold text-light-2">Exercise/Muscle Target</FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Input {...field} placeholder="E.g., chest, legs, arms, etc." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-6">
                    {/* Input for Age */}
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col gap-3">
                                <FormLabel className="text-base-semibold text-light-2">Age</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Input type="number" {...field} placeholder="Enter your age" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Input for Weight */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col gap-3">
                                <FormLabel className="text-base-semibold text-light-2">Weight (kg)</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Input type="number" {...field} placeholder="Enter your weight" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Input for Height */}
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col gap-3">
                                <FormLabel className="text-base-semibold text-light-2">Height (cm)</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Input type="number" {...field} placeholder="Enter your height" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6">
                    {/* Input for Gender */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormLabel className="text-base-semibold text-light-2">Gender</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <select {...field} value={field.value || ""} className="border-none bg-dark-3 text-light-1">
                                        <option value="" disabled>
                                            Select your gender
                                        </option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Input for Goal */}
                    <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormLabel className="text-base-semibold text-light-2">Goal</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <select {...field} value={field.value || ""} className="border-none bg-dark-3 text-light-1">
                                        <option value="" disabled>
                                            Select your goal
                                        </option>
                                        <option value="weight_loss">Weight Loss</option>
                                        <option value="muscle_gain">Muscle Gain</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Input for Extra Details */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base-semibold text-light-2">Extra Details</FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea rows={5} {...field} placeholder="Enter any other details" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit" className="bg-primary-500">
                    Generate Workout
                </Button>
            </form>
        </Form>
    );
}

export default CreateWorkout;
