import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); // Extract the last part of the URL (ID)

        if (!id) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const projectId = parseInt(id, 10);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}
