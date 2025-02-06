// /api/getCompletedProjects/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";


export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const projectId = url.searchParams.get("projectId");
        const userEmail = url.searchParams.get("userEmail");

        // Build the query dynamically based on the provided filters
        const where = {
            ...(projectId && { projectId: parseInt(projectId, 10) }),
            ...(userEmail && { userEmail }),
        };

        const completedProjects = await db.completedProject.findMany({
            where,
            include: {
                project: true, 
            },
        });

        return NextResponse.json(
            { message: "Completed projects fetched successfully.", completedProjects },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching completed projects:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await db.$disconnect(); 
    }
}