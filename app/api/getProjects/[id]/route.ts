import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: { params: { [key: string]: string | string[] } } // Correct type
) {
    try {
        // Extract the project ID from params
        const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

        // Validate the project ID
        const parsedProjectId = parseInt(projectId, 10);
        if (isNaN(parsedProjectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        // Fetch the project from the database
        const project = await prisma.project.findUnique({
            where: { id: parsedProjectId },
        });

        // Handle project not found
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Return the project
        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}