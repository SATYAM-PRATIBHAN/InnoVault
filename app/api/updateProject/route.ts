import { db } from "@/lib/prisma";  // ✅ Import global database instance
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id, action, remove } = await req.json();

        // Find the project by ID in the database
        const project = await db.project.findUnique({
            where: { id },
        });

        if (!project) {
            return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
        }

        // Update the project based on the action
        let updatedProject;
        if (action === "upvote") {
            updatedProject = await db.project.update({
                where: { id },
                data: {
                    upvotes: remove ? project.upvotes - 1 : project.upvotes + 1,
                },
            });
        } else if (action === "claim") {
            updatedProject = await db.project.update({
                where: { id },
                data: {
                    claims: remove ? project.claims - 1 : project.claims + 1,
                },
            });
        } else if (action === "complete") {
            updatedProject = await db.project.update({
                where: { id },
                data: {
                    completed: remove ? project.completed - 1 : project.completed + 1,
                },
            });
        } else {
            return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ success: true, project: updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
    }
}
