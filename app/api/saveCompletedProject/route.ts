import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "/public/completedProjects.csv");

export async function POST(req: Request) {
    try {
        const { userEmail, githubLink, projectName } = await req.json();
        if (!userEmail || !githubLink || !projectName) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        let projectId = 1;
        let fileData = "";
        if (fs.existsSync(filePath)) {
            fileData = fs.readFileSync(filePath, "utf8");
            const lines = fileData.trim().split("\n");
            if (lines.length > 1) {
                const lastLine = lines[lines.length - 1].split(",");
                projectId = parseInt(lastLine[0], 10) + 1;
            }
        } else {
            fs.writeFileSync(filePath, "projectId,projectName,userWhoCompleted,projectLink\n");
        }

        const newEntry = `\n${projectId},${projectName},${userEmail},${githubLink}`;
        fs.appendFileSync(filePath, newEntry);

        return NextResponse.json({ message: "Project submitted successfully!" }, { status: 200 });
    } catch (error) {
        return console.log(error)
    }
}
