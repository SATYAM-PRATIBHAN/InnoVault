// /api/saveCompletedProject/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { retry } from "@/utils/retry";


export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();
        const { projectId, userEmail, githubLink } = body;

        // Validate input
        if (!projectId || !userEmail || !githubLink) {
            return NextResponse.json(
                { error: "All fields (projectId, userEmail, githubLink) are required." },
                { status: 400 }
            );
        }

        // Check if the project exists
        const project = await retry(() => db.project.findUnique({
            where: { id: projectId },
        }))

        if (!project) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        // Check if the project has already been completed by this user
        const existingCompletion = await db.completedProject.findUnique({
            where: { projectId },
        });

        if (existingCompletion) {
            return NextResponse.json(
                { error: "This project has already been marked as completed." },
                { status: 409 } // Conflict status code
            );
        }

        // Create the completed project entry
        const completedProject = await db.completedProject.create({
            data: {
                projectId,
                userEmail,
                githubLink,
            },
        });

        // Update the `completed` field in the Project table
        await db.project.update({
            where: { id: projectId },
            data: { completed: { increment: 1 } },
        });

        // Return success response
        return NextResponse.json(
            { message: "Project marked as completed successfully.", completedProject },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving completed project:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await db.$disconnect(); // Disconnect Prisma client
    }
}