import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { restrictByIP } from "@/utils/ipWhiteList";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    restrictByIP(req, res, () => {
        res.json({ message: "This route is restricted by IP." });
    });
}
const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const projectId = parseInt(params.id, 10);
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
