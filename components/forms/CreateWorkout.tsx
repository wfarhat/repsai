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

async function handleCreateWorkout(values: WorkoutFormValues, userId: string) {
    try {
        const response = await fetch("/api/generateWorkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values), // Directly use values as it's already the right format
        });

        if (!response.ok) throw new Error("Failed to generate workout");

        const data = await response.json();
        const exercises = data.exercises;

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


function CreateWorkout({ userId }: Props) {
    const router = useRouter();

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

    const onSubmit = async (values: WorkoutFormValues) => {
        const success = await handleCreateWorkout(values, userId);
        form.reset();
        router.push(`/workout`);

    };

    return (
        <Form {...form}>
            <form className="mt-10 flex flex-col justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
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

                <Button type="submit" className="bg-primary-500">
                    Generate Workout
                </Button>
            </form>
        </Form>
    );
}

export default CreateWorkout;
