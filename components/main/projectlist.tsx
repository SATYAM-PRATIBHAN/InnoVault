"use client";
import { useState, useEffect } from "react";
import ProjectCard from "./project-card";
import { Project } from "@/public/types";
import { PacmanLoader } from "react-spinners";

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false); // State for create project modal
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        tags: "",
        creatorEmail: "",
    });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 9;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/getProjects");
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                const data = await response.json();

                const sortedProjects = data.sort((a: Project, b: Project) => a.id - b.id);

                setProjects(sortedProjects);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    
    // Filter projects based on search query (tags)
    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Calculate the range of projects to show based on the current page
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(
        indexOfFirstProject,
        indexOfLastProject
    );

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

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Send the new project data to the backend
            const response = await fetch("/api/addProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProject), // Send the new project data as JSON
            });

            if (!response.ok) {
                alert("failed to add Project")
            }

            // Get the created project data from the response
            const createdProject = await response.json();

            // Update the projects list with the newly created project
            setProjects((prev) => [...prev, createdProject.project]);

            // Reset the form and close the modal
            setIsCreating(false);
            setNewProject({
                title: "",
                description: "",
                tags: "",
                creatorEmail: "",
            });
        } catch (err) {
            setError((err as Error).message);
        }
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
                <p>Error loading projects: {error}</p>
            </div>
        );
    }

    return (
        <div className="mt-8 mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold">Projects</h1>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto flex-grow"
                />

                {/* Create Project Button */}
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
                >
                    Create Project
                </button>
            </div>

            {filteredProjects.length === 0 ? (
                <p className="h-screen flex justify-center items-center text-xl text-center text-gray-500">
                    No projects found matching your search.
                </p>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentProjects.map((project) => (
                            <ProjectCard key={project.id} projectId={project.id} />
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
                                    <span key={index} className="text-gray-700">
                                        ...
                                    </span>
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

            {/* Create Project Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newProject.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newProject.description}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={newProject.tags}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Creator Email
                                </label>
                                <input
                                    type="email"
                                    name="creatorEmail"
                                    value={newProject.creatorEmail}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}