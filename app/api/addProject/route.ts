import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { title, description, tags, creatorEmail } = await req.json();

        if (!title || !description || !tags || !creatorEmail) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "projects.json");

        // Read JSON file
        let jsonData = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf8");
            jsonData = JSON.parse(fileData);
        }

        // Generate a new ID
        const newId = jsonData.length ? jsonData[jsonData.length - 1].id + 1 : 1;

        // New project entry
        const newProject = {
            id: newId,
            title,
            description,
            tags,
            upvotes: 0,
            comments: 0,
            claims: 0,
            status: "New",
            creatorEmail
        };

        // Add new project to the array
        jsonData.push(newProject);

        // Write updated JSON data back to file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

        return NextResponse.json({ message: "Project added successfully!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
