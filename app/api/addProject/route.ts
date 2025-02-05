import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { title, description, tags, creatorEmail } = await req.json();

        if (!title || !description || !tags || !creatorEmail) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "projects.csv");

        // Read CSV file
        const csvData = fs.readFileSync(filePath, "utf8");
        const rows = csvData.trim().split("\n");
        const lastRow = rows.length > 1 ? rows[rows.length - 1].split(",") : [];
        const lastId = lastRow.length ? parseInt(lastRow[0], 10) || 0 : 0;
        const newId = lastId + 1;

        // New entry for CSV
        const newEntry = `${newId},${title},${description},"${tags}",0,0,0,New,${creatorEmail}\n`;

        // Append to CSV file
        fs.appendFileSync(filePath, newEntry, "utf8");

        return NextResponse.json({ message: "Project added successfully!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
