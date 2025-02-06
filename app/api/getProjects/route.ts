import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { retry } from "@/utils/retry";


export async function GET() {
  try {
    const projects = await retry(() => db.project.findMany());
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
