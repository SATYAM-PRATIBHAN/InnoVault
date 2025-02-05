"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import ProjectCard from "./project-card";
import { Project } from "@/public/types";
import { RoughNotation } from "react-rough-notation";
import BlurFade from "../ui/blur-fade";
import { PacmanLoader } from "react-spinners";


export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const projectsPerPage = 9;

    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        tags: "",
        upvotes: 0,
        claims: 0,
        completed: 0,
        status: "New",
        creatorEmail: "",
    });

    useEffect(() => {
        fetch("/projects.csv")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch CSV file");
                }
                return response.text();
            })
            .then((csvData) => {
                const parsedData = parseCSV(csvData);
                setProjects(parsedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching CSV:", error);
                setLoading(false);
            });
    }, []);

    function parseCSV(csvText: string): Project[] {
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
        });

        return parsed.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            tags: row.tags.split(","),
            upvotes: row.upvotes,
            claims: row.claims,
            completed: row.completed,
            status: row.status,
            creatorEmail: row.creator_email,
        }));
    }

    const filteredProjects = projects.filter((project) =>
        project.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (name === "tags") {
            setNewProject((prev) => ({
                ...prev,
                [name]: value, 
            }));
        } else {
            const sanitizedValue = value.replace(/,/g, " ");
            setNewProject((prev) => ({
                ...prev,
                [name]: sanitizedValue,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const response = await fetch("/api/addProject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProject),
        });
    
        if (response.ok) {
            alert("Project added successfully!");
            setIsModalOpen(false);
            window.location.reload(); 
        } else {
            alert("Error adding project.");
        }
    };

    return (
        <div className="mt-8 mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
            <div className="mb-8 text-center">
                <BlurFade>
                    <h1 className="text-4xl md:text-6xl font-extrabold">Projects</h1>
                </BlurFade>
                <p className="mt-3 text-base md:text-lg font-mono">
                    Find the best <RoughNotation type="circle" color="blue" show={true}>Projects</RoughNotation> to work on.
                </p>
            </div>
    
            {/* Showing Loader if loading is true */}
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <PacmanLoader color="#000" loading={loading} size={20} />
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                        <input
                            type="text"
                            placeholder="Search by tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                        >
                            Create New Project
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentProjects.map((project) => (
                            <ProjectCard key={project.id} data={project} />
                        ))}
                    </div>
    
                    <div className="flex justify-center mt-6 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        
                        {/* Show first 3 pages */}
                        {currentPage > 3 && (
                            <button
                                onClick={() => handlePageChange(1)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                1
                            </button>
                        )}

                        {currentPage > 3 && <span className="px-4 py-2">...</span>}

                        {/* Show the current page and surrounding pages */}
                        {[...Array(3)].map((_, index) => {
                            const page = currentPage - 1 + index;
                            if (page >= 1 && page <= totalPages) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 border rounded-lg ${currentPage === page ? "bg-gray-300" : ""}`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                            return null;
                        })}

                        {/* Show last page if applicable */}
                        {currentPage < totalPages - 2 && (
                            <>
                                <span className="px-4 py-2">...</span>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

    
                    {/* Modal for adding new project */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                        <div className="bg-[#ffffff] p-6 rounded-2xl w-full sm:w-96 md:w-96 lg:w-96 xl:w-1/3 border border-black shadow-2xl">
                            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
                                Create New Project
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={newProject.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#ffffff] border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={newProject.description}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#ffffff] border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <input
                                    type="text"
                                    name="tags"
                                    placeholder="Tags (comma separated)"
                                    value={newProject.tags}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#ffffff] border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <input
                                    type="email"
                                    name="creatorEmail"
                                    placeholder="Your Email"
                                    value={newProject.creatorEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#ffffff] border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                        
                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
                                    >
                                        Add Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    )} 
                </>
            )}
        </div>
    );
    
}
