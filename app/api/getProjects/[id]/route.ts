import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";


export async function GET(req: NextRequest) {
    try {
        // Extract `id` from the request URL
        const { pathname } = new URL(req.url);
        const parts = pathname.split("/");
        const id = parts[parts.length - 1]; // Get last part of the URL (ID)

        if (!id) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const projectId = parseInt(id, 10);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const project = await db.project.findUnique({
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
