"use client";
import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { RoughNotation } from "react-rough-notation";
interface CompletedProject {
    id: number;
    projectId: number;
    userEmail: string;
    githubLink: string;
    submittedAt: string;
    project: {
        title: string;
        description: string;
        tags: string[];
        status: string;
        creatorEmail: string;
    };
}

export default function CompletedProjectsList() {
    const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 9;

    useEffect(() => {
        const fetchCompletedProjects = async () => {
            try {
                const response = await fetch("/api/getCompletedProjects");
                if (!response.ok) {
                    throw new Error("Failed to fetch completed projects.");
                }
                const data = await response.json();
                setCompletedProjects(data.completedProjects);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchCompletedProjects();
    }, []);

    // Filter projects based on search query (title or tags)
    const filteredProjects = completedProjects.filter((project) =>
        project.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    // Handle page navigation
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Determine the total number of pages
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    // Generate page numbers for the pagination
    const generatePageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const range = 1; // How many page numbers to show before and after the current page
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > range + 1) {
                pageNumbers.push("...");
            }
            for (let i = currentPage - range; i <= currentPage + range; i++) {
                if (i > 0 && i < totalPages && !pageNumbers.includes(i)) {
                    pageNumbers.push(i);
                }
            }
            if (currentPage < totalPages - range) {
                pageNumbers.push("...");
            }
            if (!pageNumbers.includes(totalPages)) {
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <PacmanLoader color="#000" loading={loading} size={20} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center">
                <p>Error loading completed projects: {error}</p>
            </div>
        );
    }

    return (
        <div className="mt-8 h-screen mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold">Completed <RoughNotation animationDelay={500} type="underline" show={true}>Projects</RoughNotation></h1>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by title or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
                />
            </div>

            {filteredProjects.length === 0 ? (
                <p className="text-center text-gray-500">
                    No completed projects found matching your search.
                </p>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-2xl transition duration-300"
                            >
                                {/* Project Title */}
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-900">
                                    {project.project.title}
                                </h2>

                                {/* Project Description */}
                                <p className="text-gray-700 text-sm mb-4">{project.project.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.project.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-300 text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Submitted By */}
                                <p className="text-sm text-gray-600 mb-2">
                                    Submitted by: {project.userEmail}
                                </p>

                                {/* GitHub Link */}
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm block mb-2"
                                >
                                    <RoughNotation animationDelay={500} type="box" color="black" show={true}>View on GitHub</RoughNotation>
                                </a>

                                {/* Submission Date */}
                                <p className="text-xs text-gray-500">
                                    Submitted on:{" "}
                                    {new Date(project.submittedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-8 items-center">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-4 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <div className="flex gap-2">
                            {generatePageNumbers().map((page, index) =>
                                typeof page === "number" ? (
                                    <button
                                        key={index}
                                        onClick={() => paginate(page)}
                                        className={`px-3 py-2 rounded-md ${
                                            page === currentPage
                                                ? "bg-gray-800 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span key={index} className="text-gray-700">...</span>
                                )
                            )}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-4 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}