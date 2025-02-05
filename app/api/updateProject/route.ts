import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id, action, remove } = await req.json();
        const filePath = path.join(process.cwd(), "public", "projects.json");

        // Read the JSON file
        let jsonData = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf8");
            jsonData = JSON.parse(fileData);
        }

        // Update the project based on the action
        const updatedData = jsonData.map((project: any) => {
            if (project.id === id) {
                const updatedProject = { ...project };
                if (action === "upvote") {
                    updatedProject.upvotes = remove ? updatedProject.upvotes - 1 : updatedProject.upvotes + 1;
                } else if (action === "claim") {
                    updatedProject.claims = remove ? updatedProject.claims - 1 : updatedProject.claims + 1;
                } else if (action === "complete") {
                    updatedProject.claims = remove ? updatedProject.claims - 1 : updatedProject.claims + 1;
                }
                return updatedProject;
            }
            return project;
        });

        // Write the updated data back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
    }
}
