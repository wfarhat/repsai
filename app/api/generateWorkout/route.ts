import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { age, weight, height, gender, goal, title, description, exerciseTarget } = await req.json();

        const prompt = `Create a detailed workout plan for a ${age}-year-old ${gender} weighing ${weight} kg and ${height} cm tall, with the goal of ${goal}. 
        Focus on targeting the following muscle group(s) or exercises: ${exerciseTarget}. Please pay special attention to ${description}

        The workout should be formatted as an array of exercises, with each exercise containing:
        - Exercise name
        - Number of sets
        - Number of reps
        Please format the response as JSON, like this: This is very important! For reps and sets I only want a number. nothing else.
        [
            { "name": "Exercise 1", "sets": 3, "reps": 10},
            { "name": "Exercise 2", "sets": 4, "reps": 12}
        ]
        Don't add any messages or Important or anything at the end. I simply want my array of exercises.
        `;

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not defined. Please set GOOGLE_GEMINI_API_KEY in your .env.local file.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        let generatedText = result.response.text();
        console.log("Generated Workout:", generatedText);

        generatedText = cleanGeneratedText(generatedText);

        let exercises;
        try {
            exercises = JSON.parse(generatedText);
        } catch (parseError) {
            throw new Error("Failed to parse the generated workout into JSON format.");
        }

        return NextResponse.json({ exercises });
    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json({ error: "Failed to generate workout." }, { status: 500 });
    }
}

function cleanGeneratedText(text: string): string {
    text = text.replace(/per leg/g, "").replace(/seconds/g, "");
    return text;
}
