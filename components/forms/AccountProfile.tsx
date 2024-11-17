"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useClerk } from "@clerk/nextjs";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";

// Props interface for user profile and form controls
interface Props {
    user: {
        id: string;
        objectId: string; 
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    onboarded: boolean;
    btnTitle: string;
}

const AccountProfile = ({ user, onboarded, btnTitle }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { startUpload } = useUploadThing("media");
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();

    const [files, setFiles] = useState<File[]>([]);

    // Initialize form with validation schema and default values
    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image ? user.image : "",
            name: user?.name ? user.name : "",
            username: user?.username ? user.username : "",
            bio: user?.bio ? user.bio : "",
        },
    });

    // Form submission logic
    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values.profile_photo;

        // Check if profile photo has been changed
        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            // If image upload is successful, update profile photo URL
            if (imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url;
            }
        }

        // Update user information in the database
        await updateUser({
            name: values.name,
            path: pathname,
            username: values.username,
            userId: user.id,
            bio: values.bio,
            image: values.profile_photo,
        });

        // Redirect based on the current path
        if (pathname === "/profile/edit") {
            router.back();
        } else {
            router.push("/");
        }
    };

    // Handle image upload and preview
    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            // Validate file type
            if (!file.type.includes("image")) return;

            // Convert file to base64 string for preview
            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    // Handle user profile deletion
    const handleDeleteProfile = async () => {
        if (!clerkUser) {
            alert("User not found. Please log in and try again.");
            return;
        }

        try {
            // Confirm deletion with the user
            if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
                await clerkUser.delete(); 
                alert("Your profile has been deleted successfully.");
                await signOut(); 
                router.push("/sign-in");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("Failed to delete profile. Please try again.");
        }
    };

    return (
        // Render the form component
        <Form {...form}>
            <form
                className="flex flex-col justify-start gap-10"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {/* Profile photo upload */}
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="account-form_image-label">
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt="profile_icon"
                                        width={96}
                                        height={96}
                                        priority
                                        className="rounded-full object-contain"
                                    />
                                ) : (
                                    <Image
                                        src="/assets/profile.svg"
                                        alt="profile_icon"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                )}
                            </FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-200">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    placeholder="Add profile photo"
                                    className="account-form_image-input"
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Name input field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Username input field */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Bio input field */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit button */}
                <Button type="submit" className="bg-primary-500">
                    {btnTitle}
                </Button>

                {/* Delete profile button */}
                {onboarded && (
                    <Button
                        type="button"
                        onClick={handleDeleteProfile}
                        className="mt-4 bg-red-600 hover:bg-red-700"
                    >
                        Delete My Profile
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default AccountProfile;
