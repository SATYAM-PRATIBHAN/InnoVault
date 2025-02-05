import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id, action, remove } = await req.json();
        const filePath = path.join(process.cwd(), "public", "projects.csv");
        const csvData = fs.readFileSync(filePath, "utf8");

        const rows = csvData.trim().split("\n");
        const header = rows[0]; // Preserve the header row
        const updatedRows = [header];

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue; // Skip empty rows

            const columns = rows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            if (columns.length < 9) continue; // Ensure correct format

            const [
                projectId,
                title,
                description,
                tags, // Handles quoted fields
                upvotes,
                claims,
                completed,
                status,
                creatorEmail,
            ] = columns;

            if (!projectId) continue; // Skip this row if projectId is undefined

            const parsedId = parseInt(projectId.trim(), 10);
            let parsedUpvotes = parseInt(upvotes.trim(), 10);
            let parsedClaims = parseInt(claims.trim(), 10);
            const parsedCompleted = parseInt(completed.trim(), 10);

            if (parsedId === id) {
                if (action === "upvote") parsedUpvotes += remove ? -1 : 1;
                else if (action === "claim") parsedClaims += remove ? -1 : 1;
                else if (action === "complete") parsedClaims += remove ? -1 : 1;
            }

            updatedRows.push(
                `${parsedId},${title},${description},"${tags.replace(/"/g, "")}",${parsedUpvotes},${parsedClaims},${parsedCompleted},${status},${creatorEmail}`
            );
        }

        fs.writeFileSync(filePath, updatedRows.join("\n"), "utf8");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
    }
}
