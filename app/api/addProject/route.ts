import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; 

export async function POST(req: Request) {
    try {
        const { title, description, tags, creatorEmail } = await req.json();

        if (!title || !description || !tags || !creatorEmail) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        const tagArray = tags.split(",").map((tag: string) => tag.trim());
        // Insert new project into the database
        const newProject = await db.project.create({
            data: {
                title,
                description,
                tags : tagArray, // ✅ Convert array to JSON string
                upvotes: 0,
                claims: 0,
                completed: 0,
                status: "New",
                creatorEmail,
            },
        });

        alert("Project added successfully!");

        return NextResponse.json({ message: "Project added successfully!", project: newProject }, { status: 201 });

    } catch (error) {
        console.error("Error adding project:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
