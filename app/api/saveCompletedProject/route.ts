import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "/public/completedProjects.json");

export async function POST(req: Request) {
    try {
        const { userEmail, githubLink, projectName } = await req.json();
        if (!userEmail || !githubLink || !projectName) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        let projectId = 1;
        let completedProjects: any[] = [];
        
        // Check if the JSON file exists and read it
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf8");
            completedProjects = JSON.parse(fileData);
            if (completedProjects.length > 0) {
                const lastProject = completedProjects[completedProjects.length - 1];
                projectId = lastProject.projectId + 1; // Increment project ID
            }
        } else {
            // If the file does not exist, initialize the projects array
            completedProjects = [];
        }

        // Create a new project entry
        const newEntry = {
            projectId,
            projectName,
            userWhoCompleted: userEmail,
            projectLink: githubLink,
        };

        // Add the new entry to the array
        completedProjects.push(newEntry);

        // Write the updated array to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(completedProjects, null, 2));

        return NextResponse.json({ message: "Project submitted successfully!" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to submit project." }, { status: 500 });
    }
}
