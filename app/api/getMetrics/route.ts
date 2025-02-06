// /api/metrics/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { register, collectDefaultMetrics, Counter, Gauge } from "prom-client";

// Enable default metrics (e.g., memory usage, CPU, etc.)
collectDefaultMetrics();

// Define custom metrics
const totalProjectsCounter = new Counter({
    name: "total_projects",
    help: "Total number of projects created",
});

const completedProjectsGauge = new Gauge({
    name: "completed_projects",
    help: "Number of completed projects",
});

const totalUpvotesGauge = new Gauge({
    name: "total_upvotes",
    help: "Total number of upvotes across all projects",
});

const totalClaimsGauge = new Gauge({
    name: "total_claims",
    help: "Total number of claims across all projects",
});

const uniqueUsersGauge = new Gauge({
    name: "unique_users",
    help: "Number of unique users who have submitted projects",
});

export async function GET() {
    try {
        // Fetch total number of projects
        const totalProjects = await db.project.count();
        totalProjectsCounter.inc(totalProjects);

        // Fetch total number of completed projects
        const completedProjects = await db.completedProject.count();
        completedProjectsGauge.set(completedProjects);

        // Fetch total number of upvotes across all projects
        const totalUpvotes = await db.project.aggregate({
            _sum: {
                upvotes: true,
            },
        });
        totalUpvotesGauge.set(totalUpvotes._sum.upvotes || 0);

        // Fetch total number of claims across all projects
        const totalClaims = await db.project.aggregate({
            _sum: {
                claims: true,
            },
        });
        totalClaimsGauge.set(totalClaims._sum.claims || 0);

        // Fetch total number of unique users who have submitted projects
        const uniqueUsers = await db.completedProject.findMany({
            select: {
                userEmail: true,
            },
            distinct: ["userEmail"],
        });
        uniqueUsersGauge.set(uniqueUsers.length);

        // Return Prometheus metrics as plain text
        const metrics = await register.metrics();
        return new Response(metrics, {
            headers: { "Content-Type": register.contentType },
        });
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await db.$disconnect();
    }
}