"use client";

import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { RoughNotation } from "react-rough-notation";
import BlurFade from "../ui/blur-fade";

interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    upvotes: number;
    claims: number;
    completed: number;
    status: string;
    creatorEmail: string;
}

export default function ClaimedProjects() {
    const [claimedProjects, setClaimedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 9;
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [isSubmitted, setIsSubmitted] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const storedClaims = localStorage.getItem("claimedProjects");
        const parsedClaims = storedClaims ? JSON.parse(storedClaims) : [];
        setClaimedProjects(parsedClaims);

        // Check if the user has already submitted a project
        const submittedProjects = localStorage.getItem("submittedProjects");
        if (submittedProjects) {
            setIsSubmitted(JSON.parse(submittedProjects));
        }

        setLoading(false);
    }, []);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = claimedProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(claimedProjects.length / projectsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmitProject = (projectName: string) => {
        if (isSubmitted[projectName]) {
            alert("You have already submitted this project.");
            return;
        }

        setSelectedProject(projectName);
        setShowModal(true);
        setIsSubmitted((prevState) => ({
            ...prevState,
            [projectName]: false, // Initially, the project is not submitted
        }));
    };

    const handleSaveToJSON = () => {
        if (!userEmail || !githubLink || !selectedProject) return;

        fetch("/api/saveCompletedProject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectName: selectedProject, userEmail, githubLink }),
        });

        // Mark the project as submitted in the state and localStorage
        setIsSubmitted((prevState) => {
            const updated = { ...prevState, [selectedProject]: true };
            localStorage.setItem("submittedProjects", JSON.stringify(updated)); // Save to localStorage
            return updated;
        });

        setShowModal(false);
        setUserEmail("");
        setGithubLink("");
    };

    return (
        <div className={claimedProjects.length <= 3 ? "mt-8 flex h-screen justify-center items-center flex-col mx-auto max-w-6xl px-4 md:px-8 lg:px-12" :"mt-8 flex justify-center items-center flex-col mx-auto max-w-6xl px-4 md:px-8 lg:px-12"}>
            <div className="mb-8 text-center">
                <BlurFade>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Claimed <RoughNotation type="underline" animationDelay={500} show={true}>Projects</RoughNotation></h1>
                </BlurFade>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <PacmanLoader color="#000" loading={loading} size={20} />
                </div>
            ) : (
                <div className={claimedProjects.length === 0 ? "flex justify-center items-center p-6 h-screen max-w-screen-2xl mx-auto" : "p-6 max-w-screen-2xl mx-auto"}>
                    {claimedProjects.length === 0 ? (
                        <p className="text-base sm:text-lg md:text-xl">You haven&apos;t claimed any projects yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {currentProjects.map((project) => (
                                <div key={project.id} className="p-6 bg-white rounded-lg shadow-lg border border-gray-300 hover:shadow-2xl transition duration-300">
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-900">{project.title}</h2>
                                    <p className="text-gray-700 text-sm mb-4">{project.description}</p>
                                    <div className="text-sm font-medium py-2 px-4 rounded-full bg-blue-100 text-blue-700 w-fit">Tags: {project.tags.join(", ") || "No tags"}</div>
                                    <button 
                                        onClick={() => handleSubmitProject(project.title)} 
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                                        disabled={isSubmitted[project.title]}
                                    >
                                        {isSubmitted[project.title] ? "Submitted" : "Submit Project"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className={claimedProjects.length === 0 ? "hidden" : "flex justify-center mt-6 space-x-2"}>  
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 border rounded-lg ${currentPage === index + 1 ? "bg-gray-300" : ""}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg w-full">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Submit Project</h2>
                        <input 
                            type="email" 
                            placeholder="Your Email" 
                            value={userEmail} 
                            onChange={(e) => setUserEmail(e.target.value.replace(/,/g, ""))} 
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" 
                            className="border p-2 rounded w-full mb-2" 
                            required 
                        />
                        <input 
                            type="url" 
                            placeholder="GitHub Link" 
                            value={githubLink} 
                            onChange={(e) => setGithubLink(e.target.value.replace(/,/g, ""))} 
                            className="border p-2 rounded w-full mb-2" 
                            required 
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                            <button onClick={handleSaveToJSON} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
