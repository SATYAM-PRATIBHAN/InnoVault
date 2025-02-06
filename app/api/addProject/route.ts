import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { retry } from "@/utils/retry";

export async function POST(req: Request) {
    try {
        const { title, description, tags, creatorEmail } = await req.json();

        if (!title || !description || !tags || !creatorEmail) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const tagArray = tags.split(",").map((tag: string) => tag.trim());

        // ✅ Use retry function for database call
        const newProject = await retry(() => 
            db.project.create({
                data: {
                    title,
                    description,
                    tags: tagArray,
                    upvotes: 0,
                    claims: 0,
                    completed: 0,
                    status: "New",
                    creatorEmail,
                },
            })
        );

        return NextResponse.json({ message: "Project added successfully!", project: newProject }, { status: 201 });

    } catch (error: unknown) {
        console.error("Error adding project:", error);
        const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred"; // Type check
        return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
    }
}
